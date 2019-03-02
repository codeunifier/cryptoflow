var express = require('express')
var router = express.Router()
var request = require('request');

const {spawn} = require("child_process");

function formatDateString(date) {
    let month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    return date.getFullYear() + "-" + month + "-" + day;
}

function collectData(req, res, next) {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 5);
    let endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);

    request("https://api.coindesk.com/v1/bpi/historical/close.json?start=" + formatDateString(startDate) + "&end=" + formatDateString(endDate), {json: true}, function (err1, res1, body1) {
        if (err1) { 
            res.status(500);
            res.send("Failed getting historical data");
        } else if (body1["bpi"] == null) {
            res.status(500);
            res.send(body1);
        } else {
            request("https://api.coindesk.com/v1/bpi/currentprice.json", {json: true}, function (err2, res2, body2) {
                if (err2) {
                    res.status(500);
                    res.send("Failed getting current price");
                } else if (body2["bpi"] == null) {
                    res.status(500);
                    res.send(body2);
                } else {
                    req.historicalData = body1["bpi"];
                    req.currentData = body2["bpi"]["USD"]["rate_float"];
                    req.disclaimer = body2["disclaimer"];
                    next();
                }
            });
        }
    });
}

router.get('/prediction/:lookback', collectData, function (req, res) {
    //TODO: update this to not hard-code today's date
    req.historicalData['2019-03-02'] = req.currentData;

    var pyPredict = spawn('python', ['engine/make-predictions.py', JSON.stringify(req.historicalData), req.params.lookback]);
    pyPredict.stdout.setEncoding("utf8");

    var dataStream = [];
    var errorStream = [];

    pyPredict.stdout.on("data", function (data) {
        dataStream.push(data);
    });
    pyPredict.stdout.on("error", function (data) {
        errorStream.push(data);
    });
    pyPredict.stdout.on("end", function (data) {
        //TODO: get this working on staging
        if (errorStream.length > 0) {
            console.log("ERROR IN PYTHON SCRIPT:");
            console.log(errorStream);
            res.json( { "prediction": null } );
        } else {
            console.log("Python output:");
            console.log(dataStream);
            var last = dataStream.pop();
            res.json( { "prediction": parseFloat(last), "historical": req.historicalData, "current": req.currentData, "disclaimer": req.disclaimer } );
        }
    });
});

module.exports = router;