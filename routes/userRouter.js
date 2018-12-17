const userRouter = require("express").Router();
const getUserByName = require("../controllers/users");

userRouter.get("/:username", getUserByName);

module.exports = userRouter;
