const jwt = require("jsonwebtoken");
const { tokenTypes } = require("../configs/tokenTypes");
const { Token } = require("../models");
const moment = require("moment");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const userService = require("../services/user.service");

const generateToken = (
  userId,
  type,
  expiresIn = "1d",
  secret = process.env.SESSION_SECRET
) => {
  const payload = {
    sub: userId,
    exp: moment().add(expiresIn, "seconds").unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.SECRET);
  const verifyTok = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!verifyTok) {
    throw new Error("Token not found");
  }
  return verifyTok;
};

const saveToken = async (
  token,
  userId,
  type,
  expiresIn,
  blacklisted = false
) => {
  const tokenDoc = await Token.create({
    token,
    type,
    expires: moment().add(expiresIn, "seconds").toDate(), // Save expiration time as Date
    blacklisted,
    user: userId,
  });
  if (!tokenDoc) throw new Error("Token not saved");
  return tokenDoc;
};

const generateAuthTokens = async (user) => {
  const accessToken = generateToken(user.id, "5m", tokenTypes.ACCESS);

  const refreshToken = generateToken(user.id, "30d", tokenTypes.REFRESH);

  await saveToken(
    refreshToken,
    user.id,
    tokenTypes.REFRESH,
    30 * 24 * 60 * 60, // 30 days in seconds
    true
  );

  return {
    access: {
      token: accessToken,
      expires: moment().add("5m").toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: moment().add("30d").toDate(),
    },
  };
};

const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "No user found with this email"
    );

  const expires = 10 * 60; // 10 minutes in seconds
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    tokenTypes.RESET_PASSWORD,
    expires
  );
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "No user found with this email"
    );

  const expires = 10 * 60; // 10 minutes in seconds
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, tokenTypes.VERIFY_EMAIL, expires);
  return verifyEmailToken;
};

module.exports = {
  generateAuthTokens,
  generateToken,
  saveToken,
  verifyToken,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
