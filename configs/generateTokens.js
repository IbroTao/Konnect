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
  return jwt.sign(payload, secret);
};

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.SESSION_SECRET);
    const user = await userService.getUserById(payload.sub);
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.SESSION_SECRET);
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
  const accessTokenExpiration = "1d"; // 1 day
  const refreshTokenExpiration = "30d"; // 30 days

  const accessToken = generateToken(
    user.id,
    accessTokenExpiration,
    tokenTypes.ACCESS
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpiration,
    tokenTypes.REFRESH
  );

  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpiration,
    tokenTypes.REFRESH
  );

  const accessTokenExpires = moment().add(1, "day");
  const refreshTokenExpires = moment().add(30, "days");

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
  const user = await userService.getUserByEmail(email);
  if (!user)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "No user with this email"
    );
  const expires = moment().add(10, "minutes");
  const verifyEmailToken = generateToken({
    email: user.email,
    userId: user.id,
    expires,
    type: tokenTypes.VERIFY_EMAIL,
  });
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
