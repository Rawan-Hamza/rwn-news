const db = require("../db/connection");

const readTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};

const readArticles = () => {
  return db
    .query(
      `
    SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `
    )
    .then((result) => result.rows);
};

const readArticlesById = (article_id) => {
  return db
    .query(
      `
    SELECT * from articles
    WHERE article_id = $1;
  `,
      [article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ msg: "not found", status: 404 });
      } else {
        return result.rows[0];
      }
    });
};

const readComments = (article_id) => {
  return db
    .query(
      `
  SELECT * from comments
  WHERE article_id = $1
  ORDER BY created_at DESC;
    `,
      [article_id]
    )
    .then((result) => { 
      if (result.rowCount === 0) {
        return db
      .query(
        `
      SELECT * from articles
      WHERE article_id = $1;
    `,
        [article_id]
      )
      } return result
     
    }).then((result) => {
      if(result.rowCount === 0) {
        return Promise.reject({msg: "not found", status: 404})
      } else {
        return result.rows
      }
    })
};

const publishComments = (article_id, username, body) => {
  return db.query(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    returning *;
  `, [article_id, username, body])

  .then((result) => {
    return result.rows[0]
  })
}



module.exports = { readTopics, readArticles, readArticlesById, readComments, publishComments };
