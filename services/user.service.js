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
  const newUser = await user.save();
  return newUser;
};

const updateUserPrimitively = async (userId, updateBody) => {
  return User.findOneAndUpdate({ _id: userId }, updateBody);
};

const updateUserByEmail = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }
  await isUsernameTaken(updateBody.username);
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  }
  await user.remove();
  return user;
};

const followUser = async (currentUser, userId) => {
  let user1, user2;
  user1 = await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $inc: { totalFollowers: 1 },
    },
    {
      new: true,
    }
  );
  if (!user1) {
    throw new Error("could not accept request");
  }

  user2 = await User.findOneAndUpdate(
    {
      _id: currentUser,
    },
    {
      $inc: { totalFollowings: 1 },
    },
    {
      new: true,
    }
  );

  await Follow.create({
    followedUser: userId,
    followingUser: currentUser,
  });

  return { username: user1.username, userId: user2._id };
};

const unfollowUser = async (currentUser, userId) => {
  const user1 = await User.updateOne(
    {
      _id: userId,
    },
    {
      $inc: { totalFollowers: -1 },
    },
    {
      new: true,
    }
  );
  if (!user1) {
    throw new Error("could not accept request");
  }

  const user2 = await User.updateOne(
    {
      _id: currentUser,
    },
    {
      $inc: { totalFollowings: -1 },
    },
    {
      new: true,
    }
  );

  if (!user2) {
    throw new Error("could not accept request");
  }

  await Follow.deleteOne({
    $and: [{ followedUser: userId }, { followingUser: currentUser }],
  });
  return true;
};

const getUsersFollowers = async (filter, options) => {
  const followers = await Follow.paginate({ ...filter }, { ...options });
  return followers;
};

const isUserFollowing = async (userId, currentUserId) => {
  return Follow.findOne({
    $and: [{ followedUser: userId }, { followingUser: currentUserId }],
  }).lean();
};

const getAllFollowers = async (userId) => {
  return Follow.find({ folllowedUser: userId }).lean();
};

const getUsersFollowing = async (filter, options) => {
  const following = await Follow.paginate({ ...filter }, { ...options });
  return following;
};

module.exports = {
  createUser,
  getUserByUsername,
  queryUsers,
  getUserById,
  returnUserData,
  getUserByEmail,
  updateUserById,
  updateUserByEmail,
  updateUserPrimitively,
  deleteUserById,
  followUser,
  unfollowUser,
  getUsersFollowers,
  isUserFollowing,
  getAllFollowers,
  getUsersFollowing,
};
