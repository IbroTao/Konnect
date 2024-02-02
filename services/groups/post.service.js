const myCustomLabels = require("../../utils/myCustomLabels");
const { GroupPosts } = require("../../models");

const createPost = async (data) => {
  const post = await GroupPosts.create(data);
  return post;
};

module.exports = {
  createPost,
};
