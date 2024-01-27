const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const config = require("../configs/config");
const { Token } = require("../models");
const userService = require("../services/user.service");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../configs/tokenTypes");

const generateToken = async (
  userId,
  expires,
  type,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, type, userId, expires, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blcklisted: false,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
};
