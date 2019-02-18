const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/apiRouter");
const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL || require("./config");
const { handle400s, handle404s, handle500s } = require("./errorHandlers");
const cors = require("cors");

app.use(cors());
app.options('*', cors())

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`Connected to database ${DB_URL}`))
  .catch(console.log);

// app.set("view engine", "ejs");

app.use(bodyParser.json());

// app.use(express.static("public"));

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  next({ status: 404, msg: "Path Not Found" });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    res.status(400).send({ msg: err.message });
  } else if (err.name === "CastError") {
    res.status(400).send({ msg: err.message });
  } else if (err.name === "Path Not Found") {
    res.status(404).send({ msg: err.message });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ msg: err.msg || "Internal Server Error" });
});

module.exports = app;
