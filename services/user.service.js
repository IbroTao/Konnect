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

const getUserById = async (id) => {
  return User.findById(id);
};

const returnUserData = async (id) => {
  return User.findById(id).select(["-password", "-name", "-updatedAt"]);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, MESSAGES.EMAIL_TAKEN);
  }
  if (updateBody) {
    await isUsernameTaken(`@${updateBody.username}`);
    updateBody.username = `@${updateBody.username}`;
  }

  Object.assign(user, updateBody);
  const newUser = await User.save();
  return newUser;
};

const updateUserPrimitively = async (userId, updateBody) => {
  return User.findOneAndUpdate({ _id: userId }, updateBody);
};
module.exports = {
  createUser,
  getUserByUsername,
  queryUsers,
  getUserById,
  returnUserData,
  getUserByEmail,
  updateUserByEmail,
  updateUserPrimitively,
};
