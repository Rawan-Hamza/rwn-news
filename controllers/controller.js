const {
  readTopics,
  readArticles,
  readArticlesById,
  readComments,
  publishComments,
} = require("../models/model");

const getTopics = (req, res, next) => {
  return readTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

const getArticles = (req, res, next) => {
  return readArticles().then((articles) => {
    res.status(200).send(articles);
  });
};
const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  return readArticlesById(article_id)
    .then((articleData) => {
      res.status(200).send({ article: articleData });
    })
    .catch((err) => {
      next(err);
    });
};

const getComments = (req, res, next) => {
  const { article_id } = req.params;

  return readComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postComments = (req, res, next) => {
  const {
    body: { username, body },
    params: { article_id },
  } = req;

  return publishComments(article_id, username, body)
    .then((addedComment) => {
      res.status(201).send({ addedComment });
    })
    .catch((err) => {
      next(err);
    });
};

const patchVotes = (req, res,next) => {

}


module.exports = {
  getTopics,
  getArticles,
  getArticlesById,
  getComments,
  postComments,
  patchVotes
};
