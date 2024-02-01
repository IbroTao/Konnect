const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { tokenTypes } = require("../configs/tokenTypes");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { uniqueFiveDigits } = require("../utils/generateFiveDigits");
const { defaultEmailSender, sendEmail } = require("./email.service");

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

module.exports = {
  loginWithEmailAndPassword,
  logout,
  refreshAuth,
  forgetPassword,
  verifyEmail,
};
