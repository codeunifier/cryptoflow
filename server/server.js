const express = require('express');
const app = express();
const parser = require('body-parser');
const PORT = 8080

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log("Server started at port " + PORT);
});

app.route("/api/test").get((req, res) => {
    res.status(200).send("Hello from server!");
});

app.get((req, res, next) => {
    next();
});