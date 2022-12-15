const { readTopics, readArticles, readArticlesById } = require("../models/model");

const getTopics = (req, res, next) => {
  return readTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

const getArticles = (req, res, next) => {
  return readArticles().then((articles) => {
    res.status(200).send(articles);
  })
}

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  return readArticlesById(article_id)
  .then((articleData) => {
    res.status(200).send({article: articleData})
  })
  .catch((err) => {
    next(err)
  })
  }

module.exports = { getTopics, getArticles, getArticlesById };
