const { User } = require("../models");

const getUserByName = (req, res, next) => {
  const { username } = req.params;
  return User.find({ username: { $in: username } })
    .then(user => {
      console.log(user);
      if (user.length === 0)
        return Promise.reject({
          status: 404,
          msg: `User not found for username: ${username}`
        });
      res.send({ user });
    })
    .catch(next);
};

module.exports = getUserByName;
