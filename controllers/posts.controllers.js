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
    if (!posts) {
      res.status(404).json({ message: "Posts not found" });
    }

    res.status(200).json(posts);
  } catch (error) {
    throw new Error(error);
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    validateMongoId(postId);

    const userId = req.user._id;

    // Find the post which the user wants to like
    const post = await Posts.findById(postId);

    // Check if the user has already liked the post
    const isLiked = post.isLiked;

    // Check if the user dislike the post
    const isDisliked = post.disikes.find(
      (id) => id.toString() === userId.toString()
    );

    if (isLiked) {
      const post = await Posts.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json({ post, totalLikes: post.length });
    }
    if (isDisliked) {
      const post = await Posts.findByIdAndUpdate(
        postId,
        {
          $pull: { disikes: userId },
          isDisliked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json(post);
    } else {
      const likepost = await Posts.findByIdAndUpdate(
        postId,
        {
          $push: { likes: userId },
          isLiked: true,
        },
        {
          new: true,
        }
      );
      res.status(200).json({ likepost, totalLikes: likepost.length });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const dislikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;

    const post = await Posts.findById(postId);

    const isDisliked = post.isDisliked;
    const isLiked = post.likes.find(
      (id) => id.toString() === userId.toString()
    );

    if (isDisliked) {
      const post = await Posts.findByIdAndUpdate(
        postId,
        {
          $pull: { dislikes: userId },
          isDisliked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json(post);
    }
    if (isLiked) {
      const post = await Posts.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json({ post, totalLikes: post.length });
    } else {
      const post = await Posts.findByIdAndUpdate(postId, {
        $push: { dislikes: userId },
        isDisliked: true,
      });
      res.status(200).json(post);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const addComments = async (req, res) => {
  const { _id } = req.user;
  const { comment, postId } = req.body;
  try {
    const post = await Posts.findById(postId);
    let alreadyComment = post.comments.find(
      (userId) => userId.toString() === _id.toString()
    );

    if (alreadyComment) {
      const updatedComment = await Posts.updateOne(
        {
          comments: { $elemMatch: alreadyComment },
        },
        {
          $set: { "comments.$.comment": comment },
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedComment);
    } else {
      const updatedComment = await Posts.findByIdAndUpdate(
        postId,
        {
          $push: {
            comments: {
              comment: comment,
              commenter: _id,
            },
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedComment);
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createPost,
  editPost,
  deletePost,
  getSinglePost,
  getAllPosts,
  likePost,
  dislikePost,
  addComments,
};
