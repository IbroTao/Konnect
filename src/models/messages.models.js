const mongoose = require("mongoose");

const mesageSchema = new mongoose.Schema(
  {
    message: {
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

const Messages = mongoose.model("messages", messageSchema);

module.exports = { Messages };
