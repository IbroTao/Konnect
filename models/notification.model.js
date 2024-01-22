const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      minlength: 5,
    },
    link: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.methods.seen = function () {
  this.isSeen = true;
  return this.save();
};

const Notificatons = mongoose.model("notifications", notificationSchema);
module.exports = { Notificatons };
