const {
  DeletedAccounts,
  GroupPosts,
  SuspendedAccounts,
  SuspendedGroups,
  User,
} = require("../models");
const { userService, groupService } = require("../services");
const myCustomLabels = require("../utils/myCustomLabels");

const createAdmin = async ({ name, email, password, permissions }) => {
  return userService.createUser({
    name,
    password,
    email,
    role: "admin",
    isEmailVerirfied: true,
    permissions,
  });
};

const suspendUser = async (userId, duration, reason) => {
  await userService.updateUserById(userId, { isSuspended: true });
  return SuspendedAccounts.create({
    userId,
    duration,
    reason,
  });
};

const suspendGroup = async (groupId, reason, duration) => {
  await groupService.updateGroup(groupId, { isSuspended: true });
  return SuspendedGroups.create({
    groupId,
    reason,
    duration,
  });
};

const getSuspendedAccounts = async (filter, options) => {
  return SuspendedAccounts.paginate(filter, options);
};

const getSuspendedGroups = async (filter, options) => {
  return SuspendedGroups.paginate(filter, options);
};

const unsuspendUser = async (userId) => {
  await userService.updateUserById(userId, { isSuspended: false });
  return SuspendedAccounts.deleteOne({ userId });
};

const unsuspendGroup = async (groupId) => {
  await groupService.updateGroup(groupId, { isSuspended: false });
  return SuspendedGroups.deleteOne({ groupId });
};

const getTotalPosts = async () => {
  return GroupPosts.countDocuments();
};

const getTotalUsers = async () => {
  return User.countDocuments();
};

module.exports = {
  createAdmin,
  suspendUser,
  suspendGroup,
  getSuspendedAccounts,
  getSuspendedGroups,
  unsuspendUser,
  unsuspendGroup,
  getTotalPosts,
  getTotalUsers,
};
