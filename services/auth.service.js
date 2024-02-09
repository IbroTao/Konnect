const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { tokenTypes } = require("../configs/tokenTypes");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { uniqueSixDigits } = require("../utils/generateSixDigits");
const { defaultEmailSender, sendEmail } = require("./email.service");
const { getFromRedis, addToRedis } = require("../libs/redis");

const loginWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user)
    throw new ApiError(httpStatus.BAD_REQUEST, "account does not exist");
  if (!user.isEmailVerified)
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "verify email before you can login"
    );
  if (!user || !(await user.isPasswordMatch(password)))
    throw new ApiError(httpStatus.BAD_REQUEST, "password is not correct");
  user.status = "online";
  await user.save();
  return user;
};

const resetPassword = async (digits, newPassword) => {
  const email = await getFromRedis(digits.toString());
  if (!email)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "6 digits code has expired or is wrong"
    );
  const user = await User.findOne({ email });
  user.password = newPassword;
  return user.save();
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) throw new ApiError(httpStatus.NOT_FOUND, "not found");
  await refreshTokenDoc.remove();
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) throw new Error();
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "please authenticate");
  }
};

const forgetPassword = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (user.password === "none")
    throw new ApiError(httpStatus.BAD_REQUEST, "provide your password");
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  const digits = uniqueFiveDigits();
  return { user: user.name, digits };
};

const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

const verifyAccount = async (digits) => {
  const value = await getFromRedis(digits);
  if (!value)
    throw new Error(
      "cannot find resource, the 6 digits code might have expired."
    );
  return User.findOneAndUpdate({ _id: value }, { isEmailVerified: true });
};

const getVerificationCode = async (req, user) => {
  const digits = uniqueSixDigits();
  const link = `https://konnect.com`;
  await addToRedis(digits.toString(), user._id.toString(), 60 * 60 * 3);

  return defaultEmailSender(user.email, "Verify Your Account", {
    digits,
    link,
    name: user.name,
  });
};

module.exports = {
  loginWithEmailAndPassword,
  verifyAccount,
  logout,
  refreshAuth,
  getVerificationCode,
  forgetPassword,
  verifyEmail,
  resetPassword,
};
