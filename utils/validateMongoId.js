const mongoose = require("mongoose");

const validateMongoId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("This Id is invalid or not found!");
};

module.exports = { validateMongoId };
