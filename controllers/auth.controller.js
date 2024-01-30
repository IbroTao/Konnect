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
  const verifyAcc = await authService.getVerificationCode(req, user);
  console.log(verifyAcc);
  res.status(httpStatus.CREATED).json({ user, verifyAcc });
});

const resendVerificationCode = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  await authService.getVerificationCode(req, user);
  res.status(httpStatus.OK).json({ message: MESSAGES.SEND_VERIFICATION_CODE });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.OK).json({ ...tokens });
});

module.exports = {
  register,
  resendVerificationCode,
  login,
  logout,
  refreshTokens,
};
