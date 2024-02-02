const myCustomLabels = require("../../utils/myCustomLabels");
const { GroupPosts } = require("../../models");

const createPost = async (data) => {
  const post = await GroupPosts.create(data);
  return post;
};

const getPostById = async (id) => {
  const post = await GroupPosts.findById(id)
    .populate("author", "username name avatar")
    .select(["-likes", "-shares"])
    .lean();
  return post;
};

const updatePost = async (data, id) => {
  const post = await GroupPosts.updateOne({ _id: id }, data);
  return post;
};

// uses findOneAndUpdate to return the data to the controller
const updatePostAndReturn = async (data, id) => {
  const post = await GroupPosts.findByIdAndUpdate(id, data).populate(
    "author",
    "username"
  );
  return post;
};

const deletePost = async (id) => {
  return await GroupPosts.deleteOne({ _id: id });
};

module.exports = {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  updatePostAndReturn,
};
