const { Users } = require("../models/user.model");
const { catchAsync } = require("../utils/catchAsync");
const { uniqueFiveDigits } = require("../utils/generateDigits");

const isUsernameTaken = async (username) => {
  const user = await Users.findOne({ username });
  if (user) {
    res.status(400).json({ error: "username taken" });
  }
  if (!user && !user.username) return "available";
  return "available";
};

const register = catchAsync(async (req, res) => {
  const { username, email } = req.body;
  if (await Users.isEmailTaken(email)) {
    res.status(400).json({ error: "email taken" });
  }

  if ((await isUsernameTaken(username)) === "available") {
    const user = await Users.create({
      ...req.body,
      username: `@${username}`,
    });
  }
});

const resendVerificationCode = catchAsync(async (req, res) => {});
