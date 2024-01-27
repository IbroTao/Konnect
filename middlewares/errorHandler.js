const mongoose = require("mongoose");
const httpStatus = require("http-status");
const config = require("../configs/config");
const logger = require("../configs/logger");
const ApiError = require("../utils/ApiError");

const errorConverter = async (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

module.exports = {
  errorConverter,
};
