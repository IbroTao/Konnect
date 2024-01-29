const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  emailService,
  tokenService,
  userService,
} = require("../services");
const ApiError = require("../utils/ApiError");
const { MESSAGES } = require("../constants/responseMessages");
const { defaultEmailSender } = require("../services/email.service");

const register = catchAsync(async (req, res) => {
  const { username } = req.body;
  const user = await userService.createUser({
    ...req.body,
    username: `@${username}`,
  });
  await authService.getVerificationCode(req, user);
  res.status(httpStatus.CREATED).json({ user });
});

module.exports = { register };
