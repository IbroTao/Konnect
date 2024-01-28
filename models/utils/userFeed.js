const myCustomLabels = require("../../utils/myCustomLabels");
const { User, Post, Group } = require("../../models");

const getMostFollowedUsers = async (userId, { limit, page }) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };
};
