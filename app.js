const express = require("express");
const { getTopics } = require("./controllers/controller");
const app = express();


app.get("/api/topics", getTopics)

app.all("*", (req, res, next) => {
    res.status(404).send({msg: "path not found"});
})

module.exports = app;