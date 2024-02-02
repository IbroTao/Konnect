const {
  deletedAccount,
  groupComment,
  groupPosts,
  suspendedGroups,
  suspendedAccounts,
} = require("../models");
const { userService } = require("../services");
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

module.exports = {
  createAdmin,
};
