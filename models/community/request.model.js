const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const modelNames = require("../../constants/modelNames");
const toJSON = require("../plugins/toJSON.plugin");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.user,
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.group,
      required: true,
    },
  },
  {
    timestamps: true,
    id: false,
  }
);

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

const CommunityRequest = mongoose.model(modelNames.community_request, schema);
module.exports = { CommuntityRequest };
