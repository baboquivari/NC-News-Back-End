const _ = require("lodash");

const formatArticleData = (articleData, userDocs) => {
  console.log(userDocs);
  return articleData.map(articleDatum => {
    return {
      ...articleDatum,
      belongs_to: articleDatum.topic,
      created_by: _.sample(userDocs)._id
    };
  });
};

const formatCommentData = (commentData, userDocs, articleDocs) => {
  console.log(userDocs);
  return commentData.map(commentDatum => {
    const article = articleDocs.find(
      article => article.title === commentDatum.belongs_to
    );
    return {
      ...commentDatum,
      belongs_to: article._id,
      created_by: _.sample(userDocs)._id
    };
  });
};

module.exports = {
  formatArticleData,
  formatCommentData
};
