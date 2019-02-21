var express = require('express')
var router = express.Router()

const {spawn} = require("child_process");

router.get('/prediction', function (req, res) {
    var pyPredict = spawn('python', ['engine/make-predictions.py']);
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
            res.json( { "prediction": parseFloat(last) } );
        }
        
    });
});

module.exports = router;