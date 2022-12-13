const { readTopics, readArticles } = require("../models/model");

const getTopics = (req, res, next) => {
  return readTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

const getArticles = (req, res, next) => {
  return readArticles().then((articles) => {
    res.status(200).send(articles);
  }).catch((err) => {
    console.log(err)
  })
}


module.exports = { getTopics, getArticles };
