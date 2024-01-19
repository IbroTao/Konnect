const { Posts } = require("../models/posts.models");
const { Users } = require("../models/user.models");
const { validateMongoId } = require("../utils/validateMongoId");

const createPost = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  const file = req.file;
  try {
    const user = await Users.findOne({ _id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const post = await Posts.create({
      image: `assets/images/${file.originalname}`,
      caption: req.body.caption,
      postedBy: user._id,
    });
    if (!post) {
      res.status(400).json({ message: "Post failed to be created!" });
    }

    res.status(200).json({ message: "Post created", post });
  } catch (error) {
    throw new Error(error);
  }
};

const editPost = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const file = req.file;
  try {
    const post = await Posts.findByIdAndUpdate(
      id,
      {
        image: `assets/image/${file.originalname}`,
        caption: req.body.caption,
      },
      {
        new: true,
      }
    );
    if (!post) {
      res.status(400).json({ message: "Post failed to update!" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const post = await Posts.findByIdAndDelete(id);
  try {
    if (!post) {
      res.status(404).json({ message: "Post not found or already deleted!" });
    }

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    throw new Error(error);
  }
};

const getSinglePost = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).json({ message: "Post not found or already deleted" });
    }

    res.status(200).json(post);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllPosts = async (req, res) => {
  const posts = await Posts.find().sort({
    createdAt: "desc",
  });
  try {
    if (!post) {
      res.status(404).json({ message: "Posts not found" });
    }

    res.status(200).json(posts);
  } catch (error) {
    throw new Error(error);
  }
};

const likePost = async (req, res) => {};

module.exports = {
  createPost,
  editPost,
  deletePost,
  getSinglePost,
  getAllPosts,
};
