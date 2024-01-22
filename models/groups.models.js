const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    joinedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    id: false,
    _id: false,
  }
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 40,
      unique: true,
    },
    info: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 400,
      required: true,
    },
    type: {
      type: String,
      enum: ["private", "public"],
    },
    rules: {
      type: String,
      required: true,
    },
    adminCount: {
      type: Number,
      default: 0,
    },
    admins: [memberSchema],
    membersCount: {
      type: Number,
      default: 0,
    },
    members: [memberSchema],
    isSuspended: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("groups", groupSchema);
module.exports = { Group };
