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

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email))
    throw new ApiError(httpStatus.BAD_REQUEST);
  if ((await isUsernameTaken(userBody.username)) === "available")
    return User.create({ ...userBody });
};

const getUserByUsername = async (username) => {
  const user = await User.findOne({ username }).select([
    "name",
    "username",
    "email",
    "avatar",
    "accountType",
    "location",
    "bio",
    "gender",
    "totalFollowers",
    "totalFollowings",
  ]);
  return user;
};
