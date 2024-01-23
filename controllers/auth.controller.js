const { Users } = require("../models/user.model");
const { catchAsync } = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  const { username } = req.body;
});
