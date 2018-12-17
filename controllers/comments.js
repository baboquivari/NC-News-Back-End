const { Comment, Article } = require("../models");

const getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  return Comment.find({ belongs_to: article_id })
    .populate({ path: "article", select: "title -_id" })
    .populate("created_by")
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const addNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body, created_by } = req.body;
  const newComment = new Comment({ belongs_to: article_id, body, created_by });
  return newComment
    .save()
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const updateCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { votes } = req.query;
  let increment = 0;
  if (votes === "up") increment += 1;
  else if (votes === "down") increment -= 1;
  return Comment.findByIdAndUpdate(
    comment_id,
    {
      $inc: {
        votes: increment
      }
    },
    { new: true }
  )
    .populate({ path: "article", select: "title -_id" })
    .populate("created_by")
    .then(updatedComment => {
      if (!updatedComment)
        return Promise.reject({
          status: 404,
          msg: `Comment not found for ID: ${comment_id}`
        });
      else res.status(200).send(updatedComment);
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return Comment.findByIdAndRemove(comment_id)
    .then(deletedComment => {
      console.log(deletedComment);
      if (!deletedComment) {
        return Promise.reject({
          status: 404,
          msg: `Comment not found for ID: ${comment_id}`
        });
      } else res.status(202).send({ deletedComment });
    })
    .catch(next);
};

module.exports = {
  getCommentsByArticle,
  addNewComment,
  updateCommentVotes,
  deleteComment
};
