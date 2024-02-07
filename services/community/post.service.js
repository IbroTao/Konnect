const myCustomLabels = require("../../utils/myCustomLabels");
const { CommunityPosts } = require("../../models");

const createPost = async (data) => {
  const post = await CommunityPosts.create(data);
  return post;
};

const getPostById = async (id) => {
  const post = await CommunityPosts.findById(id)
    .populate("poster", "username name avatar")
    .select(["-likes", "-shares"])
    .lean();
  return post;
};

const updatePost = async (data, id) => {
  const post = await CommunityPosts.updateOne({ _id: id }, data);
  return post;
};

// uses findOneAndUpdate to return the data to the controller
const updatePostAndReturn = async (data, id) => {
  const post = await CommunityPosts.findByIdAndUpdate(id, data).populate(
    "poster",
    "username"
  );
  return post;
};

const deletePost = async (id) => {
  return await CommunityPosts.deleteOne({ _id: id });
};

const getPostLikes = async (postId) => {
  const post = await communityPosts
    .findById(postId)
    .populate("likes.userId", "name avatar username")
    .populate("shares.userId", "name avatar username")
    .select(["likes", "shares", "totalLikes", "totalShares"])
    .lean();
  return post;
};

const getPosts = async (
  { search, filter, communityId },
  { limit, sortedBy, orderBy }
) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const posts = await CommunityPosts.paginate(
    {
      $and: [{ content: { $regex: search, $options: "i" } }, { communityId }],
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
  const post = await CommunityPosts.findOne({
    $and: [{ _id: postId }, { "likes.userId": { $in: userId } }],
  });
  return post;
};

const shareAPost = async (userId, postId, communityId, data) => {
  const body = { poster: userId, communityId, sharedPostId: postId };

  if (data.file) {
    const d = {
      file: {
        url: data.file.url,
        publicId: date.file.url,
      },
    };
    Object.assign(body, d);
  } else if (data.content) {
    Object.assign(body, { content: data.content });
  }

  const post = await createPost(body);
  if (!post) throw new Error("cannot create post");

  return await CommunityPosts.updateOne(
    { _id: postId },
    { $addToSet: { shares: { userId } }, $inc: { totalShares: 1 } }
  );
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
  shareAPost,
};
