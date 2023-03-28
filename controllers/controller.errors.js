const handle404paths = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

const handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
};

const handleMiscErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } else if (err.msg !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

module.exports = {
  handle404paths,
  handle500s,
  handleMiscErrors,
};
