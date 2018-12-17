const mongoose = require("mongoose");
const { Topic, User, Article, Comment } = require("../models");
const { formatArticleData, formatCommentData } = require("../utils");

const seedDB = ({ articleData, commentData, topicData, userData }) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    .then(([topicDocs, userDocs]) => {
      const articles = formatArticleData(articleData, userDocs);
      return Promise.all([topicDocs, userDocs, Article.insertMany(articles)]);
    })
    .then(([topicDocs, userDocs, articleDocs]) => {
      const comments = formatCommentData(commentData, userDocs, articleDocs);
      return Promise.all([
        topicDocs,
        userDocs,
        articleDocs,
        Comment.insertMany(comments)
      ]);
    });
};

module.exports = seedDB;
