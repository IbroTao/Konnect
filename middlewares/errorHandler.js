const errorHandler = async (err, req, res, next) => {
  const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statuscode);
  res.json({
    message: err.message,
    stack: err.stack,
  });
};

module.exports = { errorHandler };
