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
  const { username, email, name } = req.body;
  const user = await userService.createUser({
    ...req.body,
    username: `@${username}`,
  });

  await emailService.getVerificationCode({
    name,
    email,
  });

  res.status(httpStatus.CREATED).json({ user, message: "6 digits code sent" });
});

const resendVerificationCode = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  await emailService.getVerificationCode({ email });
  res.status(httpStatus.OK).json({ message: MESSAGES.SEND_VERIFICATION_CODE });
});

const verifyAccount = catchAsync(async (req, res) => {
  const { digits } = req.body;
  const user = await authService.verifyAccount(digits);
  if (!user)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.CODE_EXPIRED);
  const token = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json(token);
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

const forgotPassword = catchAsync(async (req, res) => {
  const { user, digits } = await authService.forgetPassword(req.body.email);
  const link = `https://konnect.com`;

  defaultEmailSender(req.body.email, "Password Reset", {
    name: user,
    link,
    digits,
  });
  res.status(httpStatus.NO_CONTENT).send();
});

// const resetPassword = catchAsync(async(req, res) => {
//    await authService.
//  })

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail({
    name: req.user.name,
    email: req.user.email,
    token: verifyEmailToken,
  });
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).json({ message: MESSAGES.EMAIL_VERIFIED });
});

// This feature is only used when the user is logged in.
// const updatePassword

module.exports = {
  register,
  sendVerificationEmail,
  login,
  logout,
  verifyAccount,
  refreshTokens,
  forgotPassword,
  verifyEmail,
  resendVerificationCode,
};
