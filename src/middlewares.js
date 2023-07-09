const env = require('../helpers/config');

function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

module.exports = {
  errorHandler,
};
