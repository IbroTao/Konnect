const {
  DeletedAccounts,
  GroupPosts,
  SuspendedAccounts,
  SuspendedGroups,
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

module.exports = {
  createAdmin,
  suspendUser,
  suspendGroup,
};
