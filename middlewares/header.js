const jwt = require("jsonwebtoken");
const { Users } = require("../models/user.models");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.token;
  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const accessToken = await jwt.verify(token, process.env.SECRET);
      const user = await Users.findById(accessToken.id);
      req.user = user;
      next();
    } else {
      res
        .status(401)
        .json({ error: "Token invalid or expired! Try logging in!" });
    }
  } catch (error) {
    throw new Error("There is no token attached to the header!");
  }
};

const authenticateAdmin = async (req, res, next) => {
  authenticateUser(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res
        .status(403)
        .json({ error: "Authentication failed, only Admin is authenticated" });
    }
  });
};

const restrictBlockedUsers = async (req, res, next) => {
  authenticateUser(req, res, () => {
    if (!req.user.isBlocked) {
      next();
    } else {
      res.status(403).json({ error: "You have been blocked" });
    }
  });
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  restrictBlockedUsers,
};
