process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const { expect } = require("chai");
const mongoose = require("mongoose");
const seedDB = require("../seed/seed");
const testData = require("../seed/testData");

describe("/api", () => {
  let topicDocs, userDocs, articleDocs, commentDocs;
  const wrongID = mongoose.Types.ObjectId();
  beforeEach(() => {
    return seedDB(testData).then(docs => {
      [topicDocs, userDocs, articleDocs, commentDocs] = docs;
    });
  });

  after(() => {
    mongoose.disconnect();
  });

  it("GET returns status 404 when path is not valid", () => {
    return request
      .get("/api/ncnews")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal("Path Not Found");
      });
  });
  it("GET returns status 404 when path is not valid", () => {
    return request
      .get("/ncnews")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal("Path Not Found");
      });
  });

  // TOPICS

  describe("/topics", () => {
    it("GET returns status 200 and an array of all the topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          console.log(topics);
          expect(topics.length).to.equal(topicDocs.length);
          expect(topics[0].title).to.equal(topicDocs[0].title);
          expect(topics[1].slug).to.equal(topicDocs[1].slug);
        });
    });
    describe("/topic_slug", () => {
      describe("/articles", () => {
        it("GET returns status 200 and array of all articles with topic", () => {
          return request
            .get(`/api/topics/${topicDocs[0].slug}/articles`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0].belongs_to).to.equal(topicDocs[0].slug);
              expect(articles[1].belongs_to).to.equal(topicDocs[0].slug);
            });
        });
        it("GET for a invalid ID returns a status 404 and error message", () => {
          return request
            .get(`/api/topics/${wrongID}/articles`)
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal(
                `Topic not found for title: ${wrongID}`
              );
            });
        });
      });
    });
  });

  // ARTICLES

  describe("/articles", () => {
    it("GET returns status 200 and an array of articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(articleDocs.length);
          expect(articles[0].title).to.equal(articleDocs[0].title);
        });
    });

    describe("/:article_id", () => {
      it("GET returns status 200 and the requested article object", () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.title).to.equal(articleDocs[0].title);
          });
      });
      it("GET for a invalid ID returns a status 400 and error message", () => {
        return request
          .get("/api/articles/123")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Cast to ObjectId failed for value "123" at path "_id" for model "articles"'
            );
          });
      });
      it("GET for a invalid ID returns a status 404 and error message", () => {
        return request
          .get(`/api/articles/${wrongID}`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(
              `Article not found for ID: ${wrongID}`
            );
          });
      });
      it("PATCH returns status 200 and article object with update votes", () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?votes=up`)
          .expect(200)
          .then(({ body: { votes, article } }) => {
            expect(votes).to.equal(articleDocs[0].votes + 1);
            expect(article.title).to.equal(articleDocs[0].title);
          });
      });
      it("PATCH returns status 200 and article object with update votes", () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?votes=down`)
          .expect(200)
          .then(({ body: { votes, article } }) => {
            expect(votes).to.equal(articleDocs[0].votes - 1);
            expect(article.title).to.equal(articleDocs[0].title);
          });
      });
      it("PATCH for an invalid ID returns a status 400 and error message", () => {
        return request
          .patch("/api/articles/123")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Cast to ObjectId failed for value "123" at path "_id" for model "articles"'
            );
          });
      });
      it("PATCH for an invalid ID returns a status 404 and error message", () => {
        return request
          .patch(`/api/articles/${wrongID}?votes=up`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(
              `Article not found for ID: ${wrongID}`
            );
          });
      });

      describe("/comments", () => {
        it("GET returns status 200 and an array of comments for article", () => {
          return request
            .get(`/api/articles/${articleDocs[0]._id}/comments`)
            .expect(200)
            .then(res => {
              expect(comments.length).to.equal(
                commentDocs.filter(comment => {
                  return comment.belongs_to === articleDocs[0]._id;
                }).length
              );
              expect(comments[0].votes).to.equal(
                commentDocs.filter(comment => {
                  return comment.belongs_to === articleDocs[0]._id;
                })[0].votes
              );
            });
        });
        it("GET for a invalid ID returns a status 400 and error message", () => {
          return request
            .get("/api/articles/123/comments")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(
                'Cast to ObjectId failed for value "123" at path "belongs_to" for model "comments"'
              );
            });
        });
        it("GET for a invalid ID returns a status 404 and error message", () => {
          return request
            .get(`/api/articles/${wrongID}`)
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal(
                `Article not found for ID: ${wrongID}`
              );
            });
        });
        it("POST returns status 201 and a comment object", () => {
          const newComment = {
            body: "This is my new comment",
            created_by: `${userDocs[0]._id}`
          };
          return request
            .post(`/api/articles/${articleDocs[0]._id}/comments`)
            .send(newComment)
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(0);
              expect(comment.created_by).to.equal(newComment.created_by);
              expect(Object.keys(comment)).to.eql([
                "votes",
                "_id",
                "body",
                "belongs_to",
                "created_by"
              ]);
            });
        });
        it("POST for invalid ID returns a status 400 and error message", () => {
          const newComment = {
            body: "This is my new comment",
            created_by: `${userDocs[0]._id}`
          };
          return request
            .post(`/api/articles/123/comments`)
            .send(newComment)
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(
                'comments validation failed: belongs_to: Cast to ObjectID failed for value "123" at path "belongs_to"'
              );
            });
        });
        it("POST for invalid body request returns status 400 and error message", () => {
          const newComment = {
            body: "This is my new comment",
            food: "Pasta"
          };
          return request
            .post(`/api/articles/${articleDocs[0]._id}/comments`)
            .send(newComment)
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(
                "comments validation failed: created_by: Path `created_by` is required."
              );
            });
        });
      });
    });
  });

  // COMMENTS

  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("PATCH returns status 200 and comment object with update votes", () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?votes=up`)
          .expect(200)
          .then(({ body: { votes } }) => {
            expect(votes).to.equal(commentDocs[0].votes + 1);
            expect(comment.body).to.equal(commentDocs[2].body);
          });
      });
      it("PATCH returns status 200 and comment object with update votes", () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?votes=down`)
          .expect(200)
          .then(({ body: { votes } }) => {
            expect(votes).to.equal(commentDocs[0].votes - 1);
            expect(comment.body).to.equal(commentDocs[2].body);
          });
      });
      it("PATCH for an invalid ID returns a status 400 and error message", () => {
        return request
          .patch("/api/comments/123")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Cast to ObjectId failed for value "123" at path "_id" for model "comments"'
            );
          });
      });
      it("PATCH for an invalid ID returns a status 404 and error message", () => {
        return request
          .patch(`/api/comments/${wrongID}?votes=up`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(
              `Comment not found for ID: ${wrongID}`
            );
          });
      });
      it("DELETE returns status 201 and deleted comment", () => {
        return request
          .delete(`/api/comments/${commentDocs[0]._id}`)
          .expect(202)
          .then(({ body: { deletedComment } }) => {
            expect(deletedComment.body).to.equal(commentDocs[0].body);
          });
      });
      it("DELETE for an invalid ID returns status 400 and error message", () => {
        return request
          .delete(`/api/comments/123`)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Cast to ObjectId failed for value "123" at path "_id" for model "comments"'
            );
          });
      });
      it("DELETE for an invalid ID returns status 404 and error message", () => {
        return request
          .delete(`/api/comments/${wrongID}`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(
              `Comment not found for ID: ${wrongID}`
            );
          });
      });
    });
  });

  // USERS

  describe("/users", () => {
    describe("/:username", () => {
      it("GET returns status 200 and user object", () => {
        return request
          .get(`/api/users/${userDocs[0].username}`)
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user[0]._id).to.equal(`${userDocs[0]._id}`);
          });
      });
      it("GET for an invalid ID returns status 404 and error message", () => {
        return request
          .get(`/api/users/123`)
          .expect(404)
          .then(res => {
            console.log(res.body.msg);
            expect(res.body.msg).to.equal(`User not found for username: 123`);
          });
      });
      it("GET for an invalid ID returns status 404 and error message", () => {
        return request
          .get(`/api/users/${wrongID}`)
          .expect(404)
          .then(res => {
            console.log(res.body.msg);
            expect(res.body.msg).to.equal(
              `User not found for username: ${wrongID}`
            );
          });
      });
    });
  });
});
