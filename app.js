const cors = require("cors");
const express = require("express");
const app = express();
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
const {
  handleMiscErrors,
  handle404paths,
  handle500s,
} = require("./controllers/controller.errors");


app.use(cors());
app.use(express.json());


app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComments);
app.patch("/api/articles/:article_id", patchVotes);
app.get("/api/users", getUsers);
app.delete("/api/articles/:article_id/comments/:comment_id", deleteCommentById);
app.get("/api", getEndPoints);


app.all("*", handle404paths);
app.use(handleMiscErrors);
app.use(handle500s);

module.exports = app;
