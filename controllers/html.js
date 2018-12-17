exports.getHomepage = (req, res, next) => {
  res.send(
    `GET /api, GET /api/topics, 
    GET /api/topics/:topic_slug/articles, 
    POST /api/topics/:topic_slug/articles, 
    GET /api/articles, 
    GET /api/articles/:article_id, 
    GET /api/articles/:article_id/comments, 
    POST /api/articles/:article_id/comments,
    PATCH /api/articles/:article_id, 
    PATCH /api/comments/:comment_id, 
    DELETE /api/comments/:comment_id, 
    GET /api/users/:username`
  );
};
