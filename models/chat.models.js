const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chat: {
      type: String,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const Chats = mongoose.model("chats", chatSchema);

module.exports = { Chats };
