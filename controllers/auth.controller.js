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
const { addRedisForCaching, addToRedis } = require("../libs/redis");
const { sendEmail } = require("../services/email.service");
const { uniqueSixDigits } = require("../utils/generateSixDigits");
const { generateAuthTokens } = require("../configs/generateTokens");
const { hashSync } = require("bcryptjs");

const register = catchAsync(async (req, res) => {
  const { username, email, name, password } = req.body;
  const user = await userService.createUser({
    ...req.body,
    username: `@${username}`,
    // password: hashSync(password, 10),
  });
  const digits = uniqueSixDigits();
  await addToRedis(digits.toString(), user._id.toString(), 60 * 60 * 3);

  const text = `<p>Thanks creating an account with us at <strong>Konnect</strong>.
  To continue registration, we sent a 6-digits code to you for further verification and authentication.

  Your 6-digit code is <h4>${digits}</h4>

  Kindly enter the code into your device to continue the registration process. For any help, you can contact us at Konnect.

  Best Wishes,
  @KonnectICT</p>`;

  await sendEmail({
    to: email,
    subject: "Account Verification",
    html: `<h4>Dear ${name}</h4> ${text}`,
  });
  res.status(httpStatus.CREATED).json({ user, message: "6 digits code sent" });
});

const resendVerificationCode = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  await authService.getVerificationCode({ email });
  res.status(httpStatus.OK).json({ message: MESSAGES.SEND_VERIFICATION_CODE });
});

const verifyAccount = catchAsync(async (req, res) => {
  const { digits } = req.body;
  const user = await authService.verifyAccount(digits);
  if (!user)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.CODE_EXPIRED);
  const token = await generateAuthTokens(user);
  res.status(httpStatus.OK).json(token);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginWithEmailAndPassword(email, password);
  const tokens = await generateAuthTokens(user);
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

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.digits, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

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

const getMe = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  user.password = "";
  await addRedisForCaching(req.user.id.toString(), JSON.stringify(user), 30);
  res.status(httpStatus.OK).json(user);
});

// This feature is only used when the user is logged in.
// const updatePassword

module.exports = {
  register,
  sendVerificationEmail,
  login,
  getMe,
  logout,
  verifyAccount,
  refreshTokens,
  forgotPassword,
  verifyEmail,
  resendVerificationCode,
  resetPassword,
};
