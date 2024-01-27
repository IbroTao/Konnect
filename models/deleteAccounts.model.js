const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const modelNames = require("../constants/modelNames");
const toJSON = require("./plugins/toJSON.plugin");

const schema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);
schema.plugin(toJSON);

const deletedAccount = mongoose.model(modelNames.deletedAccount, schema);
module.exports = deletedAccount;
