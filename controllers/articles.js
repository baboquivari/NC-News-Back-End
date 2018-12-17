const { Article, Comment } = require("../models");

const getCommentCount = article => {
  return Comment.count({ belongs_to: article._id }).then(count => {
    return count;
  });
};

const getArticleByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  return Article.find({ belongs_to: topic_slug })
    .populate({ path: "topic", select: "title -_id" })
    .populate("created_by")
    .then(articles => {
      if (articles.length === 0)
        return Promise.reject({
          status: 404,
          msg: `Topic not found for title: ${topic_slug}`
        });
      return Promise.all([
        articles,
        ...articles.map(article => {
          return getCommentCount(article);
        })
      ]);
    })
    .then(([articles, ...commentCount]) => {
      return articles.map((article, index) => {
        return { ...article._doc, comment_count: commentCount[index] };
      });
    })
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
};

const addArticleToTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  const { title, body, created_by } = req.body;
  const newArticle = new Article({
    belongs_to: topic_slug,
    title,
    body,
    created_by
  });
  return newArticle
    .save()
    .then(article => {
      return { ...article._doc, comment_count: 0 };
    })
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};

const getAllArticles = (req, res, next) => {
  return Article.find()
    .populate({ path: "topic", select: "title -_id" })
    .populate("created_by")
    .then(articles => {
      return Promise.all([
        articles,
        ...articles.map(article => {
          return getCommentCount(article);
        })
      ]);
    })
    .then(([articles, ...commentCount]) => {
      return articles.map((article, index) => {
        return { ...article._doc, comment_count: commentCount[index] };
      });
    })
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return Article.findOne({ _id: article_id })
    .populate("created_by")
    .then(article => {
      if (!article)
        return Promise.reject({
          status: 404,
          msg: `Article not found for ID: ${article_id}`
        });
      return Promise.all([article, getCommentCount(article)]);
    })
    .then(([article, commentCount]) => {
      return { article, comment_count: commentCount };
    })
    .then(article => {
      res.status(200).send(article);
    })
    .catch(next);
};

const updateVoteCount = (req, res, next) => {
  const { article_id } = req.params;
  const { votes } = req.query;
  let increment = 0;
  if (votes === "up") increment += 1;
  else if (votes === "down") increment -= 1;
  return Article.findByIdAndUpdate(
    article_id,
    {
      $inc: {
        votes: increment
      }
    },
    { new: true }
  )
    .populate("topic")
    .populate("created_by")
    .then(updatedArticle => {
      if (!updatedArticle)
        return Promise.reject({
          status: 404,
          msg: `Article not found for ID: ${article_id}`
        });
      else res.send(updatedArticle);
    })
    .catch(next);
};

module.exports = {
  getArticleByTopic,
  addArticleToTopic,
  getAllArticles,
  getArticleById,
  updateVoteCount
};
