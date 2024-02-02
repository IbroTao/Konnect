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

const getPostLikes = async (postId) => {
  const post = await GroupPosts.findById(postId)
    .populate("likes.userId", "name avatar username")
    .populate("shares.userId", "name avatar username")
    .select(["likes", "shares", "totalLikes", "totalShares"])
    .lean();
  return post;
};

const getPosts = async (
  { search, filter, groupId },
  { limit, sortedBy, orderBy }
) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const posts = await GroupPosts.paginate(
    {
      $and: [{ content: { $regex: search, $options: "i" } }, { groupId }],
      ...filter,
    },
    {
      ...(limit ? { limit } : { limit: 15 }),
      page,
      sort: { [orderBy]: sortedBy === "asc" ? 1 : -1 },
      ...options,
    }
  );
  return posts;
};

const isPostLikedByUser = async (userId, postId) => {
  const post = await GroupPosts.findOne({
    $and: [{ _id: postId }, { "likes.userId": { $in: userId } }],
  });
  return post;
};

module.exports = {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  updatePostAndReturn,
  getPostLikes,
  getPosts,
  isPostLikedByUser,
};
