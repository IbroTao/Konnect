const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    comments: {
      text: {
        type: String,
      },
      ids: Array,
      commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    disikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("posts", postSchema);

module.exports = { Posts };
