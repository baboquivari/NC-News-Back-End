exports.handle404s = (err, req, res, next) => {
  const { status, msg } = err;
  if (status === 404) res.status(status).send({ msg });
  else next({ status, msg });
};

exports.handle400s = (err, req, res, next) => {
  const { status, msg } = err;
  if (status === 400) res.status(status).send({ msg });
  else next({ status, msg });
};

exports.handle500s = (err, req, res, next) => {
  const { status, msg } = err;
  if (status === 500) res.status(status).send({ msg });
};
