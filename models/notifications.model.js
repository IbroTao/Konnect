const mongoose = require("mongoose");
const modelNames = require("../constants/modelNames");
const mongoosePaginate = require("mongoose-paginate-v2");

const notificationSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    message: {
      type: String,
      required: true,
      minlength: 1,
    },
    link: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.user,
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

notificationSchema.plugin(mongoosePaginate);

notificationSchema.methods.seen = function () {
  this.isSeen = true;
  return this.save;
};

const notificationModel = mongoose.model(
  modelNames.notification,
  notificationSchema
);
module.exports = notificationModel;
