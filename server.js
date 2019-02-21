const express = require('express');
const app = express();
const parser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 8080;
var pythonRouter = require('./server/routes/python.js');

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use('/python', pythonRouter);

app.use(express.static(path.join(__dirname, 'dist/cryptoflow')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/cryptoflow/index.html'));
});

app.get((req, res, next) => {
    next();
});

app.listen(port, () => {
    console.log("Server started at port " + port);
});