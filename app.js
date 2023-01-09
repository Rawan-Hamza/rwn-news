
const cors = require('cors');
const express = require("express");
const {
  getTopics,
  getArticles,
  getArticlesById,
  getComments,
  postComments,
  patchVotes,
  getUsers,
  deleteCommentById,
  getEndPoints,
} = require("./controllers/controller");
const app = express();
app.use(express.json());

app.use(cors());
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComments);
app.patch("/api/articles/:article_id", patchVotes);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentById)
app.get("/api", getEndPoints)


app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } else if (err.msg !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
