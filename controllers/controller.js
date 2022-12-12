const { readTopics, readArticles } = require("../models/model");

const getTopics = (req, res) => {
  return readTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

const getArticles = (req, res) => {
  return readArticles().then((articles) => {
    res.status(200).send(articles);
  });
};

module.exports = { getTopics, getArticles };
