const httpStatus = require("http-status");
const { User, Follow, deletedAccount } = require("../models");
const ApiError = require("../utils/ApiError");
const { MESSAGES } = require("../constants/responseMessages");

const isUsernameTaken = async (username) => {
  const user = await User.findOne({ username });
  if (user) throw new ApiError(httpStatus.BAD_REQUEST, "username taken");
  if (user && !user.username) {
    return "available";
  }
  return "available";
};
