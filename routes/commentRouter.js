const commentRouter = require("express").Router();
const {
  updateCommentVotes,
  deleteComment
} = require("../controllers/comments");

commentRouter
  .route("/:comment_id")
  .patch(updateCommentVotes)
  .delete(deleteComment);

module.exports = commentRouter;
