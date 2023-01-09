const db = require("../db/connection");
const fs = require("fs/promises")

const readTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};

const readArticles = (topic, sort_by = "created_at", order = "DESC") => {
  const validSortingQueries = [
    "comment_count",
    "article_id",
    "created_at",
    "votes",
    "body",
    "author",
    "title",
    "topic",
  ];

  if (!validSortingQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const queryList = [];

  let sqlQuery = `
  SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  if (topic !== undefined) {
    sqlQuery += `WHERE topic = $1`;
    queryList.push(topic);
  }

  sqlQuery += `GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};`;

  return db.query(sqlQuery, queryList).then((result) => {
    return result.rows;
  });
};

const readArticlesById = (article_id) => {
  const sqlQuery = `
    SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
    `;

  return db.query(sqlQuery, [article_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ msg: "not found", status: 404 });
    } else {
      return result.rows[0];
    }
  });
};

const readComments = (article_id) => {
  const sqlQuery = `
    SELECT * from comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `;
  return db
    .query(sqlQuery, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return db.query(
          `
      SELECT * from articles
      WHERE article_id = $1;
    `,
          [article_id]
        );
      }
      return result;
    })
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ msg: "not found", status: 404 });
      } else {
        return result.rows;
      }
    });
};

const publishComments = (article_id, username, body) => {
  const sqlQuery = `
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    returning *;
    `;
  return db.query(sqlQuery, [article_id, username, body]).then((result) => {
    return result.rows[0];
  });
};

const updateVotes = (article_id, inc_votes) => {
  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;
    `;
  return db.query(sqlQuery, [article_id, inc_votes]).then((result) => {
    return result.rows[0];
  });
};

const readUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

const removeCommentsById = (comment_id) => {
  const sqlQuery = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `

  return db.query(sqlQuery, [comment_id]).then((result) => {
    return result.rows
  })
}

const readEndPoints = () => {
return fs.readFile('endpoints.json', "utf-8")
         .then(data => data)
}

module.exports = {
  readTopics,
  readArticles,
  readArticlesById,
  readComments,
  publishComments,
  updateVotes,
  readUsers,
  removeCommentsById,
  readEndPoints
};
