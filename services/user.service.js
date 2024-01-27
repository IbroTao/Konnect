const httpStatus = require("http-status");
const { User, Follow, deletedAccount } = require("../models");
const ApiError = require("../utils/ApiError");
const { MESSAGES } = require("../constants/responseMessages");
const myCustomLabels = require("../utils/myCustomLabels");

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
    "location",
    "bio",
    "gender",
    "totalFollowers",
    "totalFollowings",
  ]);
  return user;
};

const queryUsers = async (
  { search, filter },
  { limit, page, orderBy, sortedBy }
) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };
  const users = await Users.paginate(
    {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ],
      ...filter,
    },
    {
      ...(limit ? { limit } : { limit: 10 }),
      ...page,
      sort: { [orderBy]: sortedBy === "asc" ? 1 : -1 },
      ...options,
      select: [
        "-password",
        "-dob",
        "-showMatureContent",
        "-accountType",
        "-updatedAt",
        "__v",
      ],
    }
  );
  return users;
};

module.exports = {
  createUser,
  getUserByUsername,
  queryUsers,
};
