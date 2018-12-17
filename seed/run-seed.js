// process.env.NODE_ENV = 'production'
const seedDB = require("./seed");
const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL || require("../config");
const rawData = require("./devData");

mongoose
  .connect(DB_URL)
  .then(() => {
    return seedDB(rawData);
  })
  .then(() => mongoose.disconnect())
  .catch(console.log);
