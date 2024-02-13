const jwt = require("jsonwebtoken");
const { tokenTypes } = require("../configs/tokenTypes");

const generateAccessToken = async (
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
};

module.exports = { generateAccessToken, generateRefreshToken };
