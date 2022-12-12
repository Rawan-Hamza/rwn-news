const { readTopics } = require("../models/model")

const getTopics = (req, res) => {
    return readTopics().then((topics) => {
        res.status(200).send(topics)
    })
}


module.exports = { getTopics }