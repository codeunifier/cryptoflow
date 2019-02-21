var express = require('express')
var router = express.Router()

const {spawn} = require("child_process");

router.get('/prediction', function (req, res) {
    var pyPredict = spawn('python', ['engine/make-predictions.py']);
    pyPredict.stdout.setEncoding("utf8");

    var dataStream = [];

    pyPredict.stdout.on("data", function (data) {
        dataStream.push(data);
    });
    pyPredict.stdout.on("end", function (data) {
        console.log(dataStream);
        var last = dataStream.pop();
        res.json( { "prediction": parseFloat(last) } );
    });
});

module.exports = router;