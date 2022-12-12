const db = require('../db/connection');

const readTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(result => result.rows)
}

module.exports = { readTopics }