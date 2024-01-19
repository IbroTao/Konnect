const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 150,
    },
    image: {
      type: String,
    },
    comments: [
      {
        comment: {
          type: String,
        },
        commenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
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
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: String,
      default: false,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("posts", postSchema);

module.exports = { Posts };
