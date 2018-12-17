const { Topic } = require("../models");

const getAllTopics = (req, res, next) => {
  return Topic.find({})
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};


module.exports = {
  getAllTopics
};
