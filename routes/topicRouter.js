const topicRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics");
const {
  getArticleByTopic,
  addArticleToTopic
} = require("../controllers/articles");

topicRouter.route("/").get(getAllTopics);
topicRouter
  .route("/:topic_slug/articles")
  .get(getArticleByTopic)
  .post(addArticleToTopic);

module.exports = topicRouter;
