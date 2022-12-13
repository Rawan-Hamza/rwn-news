const express = require("express");
const { getTopics, getArticles } = require("./controllers/controller");
const app = express();


app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)

app.all("*", (req, res, next) => {
    res.status(404).send({msg: "path not found"});
})

module.exports = app;