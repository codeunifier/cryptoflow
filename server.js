const express = require('express');
const app = express();
const parser = require('body-parser');
const port = process.env.PORT || 8080;

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.route("/api/test").get((req, res) => {
    res.status(200).send("Hello from server!");
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get((req, res, next) => {
    next();
});

app.listen(port, () => {
    console.log("Server started at port " + port);
});