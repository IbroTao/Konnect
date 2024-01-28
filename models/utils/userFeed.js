const myCustomLabels = require("../../utils/myCustomLabels");
const { User, Post, Group } = require("../../models");

const getMostFollowedUsers = async (userId, { limit, page }) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };
  const followers = await User.paginate(
    {
      _id: { $ne: userId },
    },
    {
      page,
      sort: { totalFollowers: -1 },
      ...(limit ? { limit } : { limit: 10 }),
      select: [
        "name",
        "username",
        "avatar",
        "totalFollowers",
        "totalFollowings",
        "bio",
        "location",
        "status",
      ],
      ...options,
    }
  );
  return followers;
};

module.exports = {
  getMostFollowedUsers,
};
