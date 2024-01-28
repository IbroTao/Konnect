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

const getMostPopulatedGroups = async (userId, { limit, page }) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };
  const groups = await Group.paginate(
    {
      "members.id": { $nin: userId },
    },
    {
      page,
      sort: { membersCount: -1 },
      ...(limit ? { limit } : { limit: 10 }),
      select: ["name", "info", "membersCount", "createdAt"],
      ...options,
    }
  );
  return groups;
};

const getMostLikedPosts = async (limit, page, dob) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  let filter = {};

  const age = new Date().getFullYear() - dob.getFullYear();
  if (age < 16) {
    filter = { mature: false };
  }

  const posts = await Book.paginate(filter, {
    page,
    sort: { likes: -1 },
    ...(limit ? { limit } : { limit: 10 }),
    select: ["poster", "caption", "likes"],
    ...options,
    populate: [
      {
        path: "author",
        select: "name username",
      },
    ],
  });
  return posts;
};

const getNewestPosts = async (limit, dob, page) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  let filter = {};

  const age = new Date().getFullYear() - dob.getFullYear();
  if (age < 16) {
    filter = { mature: false };
  }

  const posts = await Post.paginate(filter, {
    page,
    sort: { likes: -1 },
    ...(limit ? { limit } : { limit: 10 }),
    select: ["poster", "caption", "likes"],
    ...options,
    populate: [
      {
        path: "poster",
        select: "user username",
      },
    ],
  });
  return posts;
};

module.exports = {
  getMostFollowedUsers,
  getMostPopulatedGroups,
  getMostLikedPosts,
  getNewestPosts,
};
