const jwt = require("jsonwebtoken");
const { tokenTypes } = require("../configs/tokenTypes");
const { Token } = require("../models");
const moment = require("moment");

const generateToken = async (
  userId,
  type,
  secret = process.env.SESSION_SECRET
) => {
  const payload = {
    sub: userId,
    exp: "1d",
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

const saveToken = async (token, userId, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    type,
    blacklisted,
    user: userId,
  });
  if (!tokenDoc) throw new Error("Token not saved");
  return tokenDoc;
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(30000000, "minutes");
  const acessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
};

module.exports = { generateAuthTokens, generateToken, saveToken, verifyToken };
