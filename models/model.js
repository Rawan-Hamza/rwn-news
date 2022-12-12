const db = require("../db/connection");

const readTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};

const readArticles = () => {
  return db
    .query(
      `
    SELECT * FROM articles
    ORDER BY created_at DESC;
    `
    )
    .then((result) => result.rows);
};

module.exports = { readTopics, readArticles };
