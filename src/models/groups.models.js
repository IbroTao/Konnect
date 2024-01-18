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
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const Groups = mongoose.model("groups", groupSchema);

const groupMessagesSchema = new mongoose.Schema(
  {
    messages: {
      text: {
        type: String,
        required: true,
      },
      users: Array,
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  },
  {
    timestamps: true,
  }
);

const GroupMessages = mongoose.model("group_msg", groupMessagesSchema);

module.exports = { Groups, GroupMessages };
