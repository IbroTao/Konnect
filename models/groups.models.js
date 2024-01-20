const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 5,
      maxlength: 30,
    },
    description: {
      type: String,
      maxlength: 50,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    role: {
      type: String,
      default: "user",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Groups = mongoose.model("groups", groupSchema);

const groupMessagesSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const GroupMessages = mongoose.model("group_msg", groupMessagesSchema);

const groupPostsSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    caption: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
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
    totalLikes: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const GroupPosts = mongoose.model("group_posts", groupPostsSchema);

module.exports = { Groups, GroupMessages, GroupPosts };
