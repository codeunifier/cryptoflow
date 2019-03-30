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
    let endDate = new Date();

    switch (req.params.timeframeId) {
        case "0": //one week, increments of 1 day
            startDate.setDate(startDate.getDate() - 5);
            endDate.setDate(endDate.getDate() - 1);
        break;
        case "1": //one month
            startDate.setDate(startDate.getDate() - 29);
            endDate.setDate(endDate.getDate() - 1);
        break;
        case "2": //three months
            startDate.setDate(startDate.getDate() - 89);
            endDate.setDate(endDate.getDate() - 1);
        break;
        default:
        break;
    }

    console.log(formatDateString(startDate));
    console.log(formatDateString(endDate));
    
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

router.get('/prediction/:timeframeId', collectData, function (req, res) {
    var today = new Date();
    req.historicalData[formatDateString(today)] = req.currentData;

    var pyPredict = spawn('python', ['engine/make-predictions.py', JSON.stringify(req.historicalData), req.params.timeframeId]);
    pyPredict.stdout.setEncoding("utf8");

    var dataStream = [];
    var errorStream = [];

    pyPredict.stdout.on("data", function (data) {
        dataStream.push(data);
    });
    pyPredict.stderr.on("data", function (data) {
        //errorStream.push(data.toString());
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