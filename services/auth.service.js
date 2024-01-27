const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { tokenTypes } = require("../configs/tokenTypes");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { uniqueFiveDigits } = require("../utils/generateFiveDigits");
const { defaultEmailSender } = require("./email.service");

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

module.exports = {
  loginWithEmailAndPassword,
  logout,
};
