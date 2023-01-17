const { response } = require("../app");
const {
  readTopics,
  readArticles,
  readArticlesById,
  readComments,
  publishComments,
  updateVotes,
  readUsers,
  removeCommentsById,
  readEndPoints,
} = require("../models/model");

const getTopics = (req, res, next) => {
  return readTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

const getArticles = (req, res, next) => {
  const { topic, sort_by } = req.query;

  return readArticles(topic, sort_by)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
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

const patchVotes = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { article_id },
  } = req;
  return updateVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  return readUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCommentById = (req, res, next) => {
  const {
    params: { article_id, comment_id },
  } = req;
  return removeCommentsById(article_id, comment_id)
    .then((deletedComment) => {
      if (deletedComment.length) {
        res.status(204).send({ body: deletedComment });
      } else {
        res.status(404).send({ msg: "comment not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const getEndPoints = (req, res, next) => {
  return readEndPoints()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getTopics,
  getArticles,
  getArticlesById,
  getComments,
  postComments,
  patchVotes,
  getUsers,
  deleteCommentById,
  getEndPoints,
};
