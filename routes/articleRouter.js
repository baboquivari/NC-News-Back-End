const articleRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  updateVoteCount
} = require("../controllers/articles");
const {
  getCommentsByArticle,
  addNewComment
} = require("../controllers/comments");

articleRouter.route("/").get(getAllArticles);
articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateVoteCount);
articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(addNewComment);

module.exports = articleRouter;
