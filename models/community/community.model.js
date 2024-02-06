const mongoose = require("mongoose");
const { toJSON } = require("../plugins");
const mongoosePaginate = require("mongoose-paginate-v2");
const modelNames = require("../../constants/modelNames");

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.user,
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

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 40,
    },
    info: {
      type: String,
      minlength: 10,
      maxlength: 400,
      required: true,
    },
    type: {
      type: String,
      enum: ["public", "private"],
    },
    rules: {
      type: String,
      required: true,
    },
    adminsCount: {
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

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

const Community = mongoose.model(modelNames.community, schema);
module.exports = { Community };
