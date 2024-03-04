const jwt = require("jsonwebtoken");
const { tokenTypes } = require("../configs/tokenTypes");
const { Token } = require("../models");
const moment = require("moment");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const userService = require("../services/user.service");

const generateToken = (
  userId,
  expiresIn = "1d",
  type,
  secret = process.env.SESSION_SECRET
) => {
  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + moment.duration(expiresIn).asSeconds(),
    type,
  };
  console.log(payload);
  return jwt.sign(payload, secret);
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.SESSION_SECRET);
  console.log(payload);
  const verifyTok = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  console.log(verifyTok);
  if (!verifyTok) {
    throw new Error("Token not found");
  }
  return verifyTok;
};

const saveToken = async (
  token,
  userId,
  expiresIn,
  type,
  blacklisted = false
) => {
  const expirationDate = moment().add(expiresIn);
  const tokenDoc = await Token.create({
    token,
    type,
    blacklisted,
    user: userId,
    expires: expirationDate.toDate(),
  });
  if (!tokenDoc) throw new Error("Token not saved");
  return tokenDoc;
};

const generateAuthTokens = async (user) => {
  const currentYear = moment().year();
  const accessTokenExpires = moment()
    .add(30000000, "minutes")
    .year(currentYear);
  const accessToken = generateToken(
    user.id,
    "30m",
    //accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(30, "days");
  const refreshToken = generateToken(
    user.id,
    "30d",
    //refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
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

  const expires = moment().add(10, "minutes");
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (email) => {
  const expires = moment().add(10, "minutes");
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
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
