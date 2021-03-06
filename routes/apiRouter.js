const apiRouter = require("express").Router();
const cors = require('cors');
const articleRouter = require("./articleRouter");
const commentRouter = require("./commentRouter");
const userRouter = require("./userRouter");
const topicRouter = require("./topicRouter");
const { getHomepage } = require("../controllers/html");

apiRouter.all('*', cors())

apiRouter.route('/').get(getHomepage)
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
