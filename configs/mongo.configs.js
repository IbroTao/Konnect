const { connect } = require("mongoose");
require("dotenv").config();
const mongoURL = process.env.MONGO_URL;

const mongoConnection = () => {
  return connect(mongoURL);
};

module.exports = { mongoConnection };
