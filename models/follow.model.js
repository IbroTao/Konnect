const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const modelNames = require("../constants/modelNames");
const toJSON = require("./plugins/toJSON.plugin");

const schema = new mongoose.Schema({
  followedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: modelNames.user,
  },
  followingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: modelNames.user,
  },
  followedAt: {
    type: Date,
    default: new Date(),
  },
});

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

const Follow = mongoose.model(modelNames.follower, schema);
module.exports = Follow;
