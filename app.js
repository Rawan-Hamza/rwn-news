const express = require("express");
const {
  getTopics,
  getArticles,
  getArticlesById,
  getComments
} = require("./controllers/controller");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getComments);

app.all("*", (req, res, next) => {
  console.log("AAPP ALL BLOCK")
  res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  console.log("im inside the 22p error handler", err)
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("im inside the customvarious handler", err)
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("im inside the 500 SERVER  ", err)
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
