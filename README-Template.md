# Northcoders News

This project is a creation of an api which gives access to a database including information about what is happening in and around Northcoders

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

#### Dependencies:

```
body-parser
express
heroku
mongoose
```

#### Dev Dependencies:

```
chai
mocha
supertest
nodemon
```

### Installing

A step by step series of examples that tell you how to get a development env running

1. Fork/clone the repository

2. Navigate to the correct folder and install dependencies

```
e.g. npm install express
```

3. Then create a `config.js` file which contains `DB_URL` and config object

```
const ENV = process.env.NODE_ENV || "dev";
const config = {
  dev: "mongodb://localhost:27017/nc_news",
  test: "mongodb://localhost:27017/nc_news_test",
  production: **mlab URL inserted here**
};
module.exports = config[ENV];
```

4. Run `mongod` in a new terminal and seed the data base by running:

```
npm run seed:dev
```

5. The server can be run with:

```
npm run dev
```

You can then use postman or your browser to view the endpoints using you local port

## Running the tests

1. Make sure you are connected to the test database when running tests and all dependecies are installed

2. To run the test use:

```
npm test
```

### Routes

Your server should have the following end-points:

```http
GET /api
# Serves an HTML page with documentation for all the available endpoints
```

```http
GET /api/topics
# Get all the topics
```

```http
GET /api/topics/:topic_slug/articles
# Return all the articles for a certain topic
# e.g: `/api/topics/football/articles`
```

```http
POST /api/topics/:topic_slug/articles
# Add a new article to a topic. This route requires a JSON body with title and body key value pairs
# e.g: `{ "title": "new article", "body": "This is my new article content", "created_by": "user_id goes here"}`
```

```http
GET /api/articles
# Returns all the articles
```

```http
GET /api/articles/:article_id
# Get an individual article
```

```http
GET /api/articles/:article_id/comments
# Get all the comments for a individual article
```

```http
POST /api/articles/:article_id/comments
# Add a new comment to an article. This route requires a JSON body with body and created_by key value pairs
# e.g: `{"body": "This is my new comment", "created_by": "user_id goes here"}`
```

```http
PATCH /api/articles/:article_id
# Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
# e.g: `/api/articles/:article_id?vote=up`
```

```http
PATCH /api/comments/:comment_id
# Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
# e.g: `/api/comments/:comment_id?vote=down`
```

```http
DELETE /api/comments/:comment_id
# Deletes a comment
```

```http
GET /api/users/:username
# e.g: `/api/users/mitch123`
# Returns a JSON object with the profile data for the specified user.
```

## Deployment

1. Host the database publically through mLab

2. Create an app through heroku and set your config correctly before pushing to heroku before deploying

## Built With

- Node.js
- MongoDB
- Mongoose
- Express
- mLab
- Heroku

## Authors

- **Hugh Paul**
