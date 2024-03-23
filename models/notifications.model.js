const mongoose = require("mongoose");
const modelNames = require("../constants/modelNames");
const mongoosePaginate = require("mongoose-paginate-v2");

const notificationSchema = new mongoose.Schema({
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
});
