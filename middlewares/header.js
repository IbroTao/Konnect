const jwt = require("jsonwebtoken");
const { Users } = require("../models/user.models");

// Use this for Postman
// const authenticateUser = async (req, res, next) => {
//   let token;
//   if (req.headers.authorization.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//     try {
//       if (token) {
//         const accessToken = jwt.verify(token, process.env.SECRET);
//         const user = await Users.findById(accessToken.id);
//         req.user = user;
//         next();
//       }
//     } catch (error) {
//       res.status(401).json({ error: "Token expired or invalid" });
//     }
//   } else {
//     res.status(401).json({ error: "There is no token attached to the header" });
//   }
// };

// Use this for Insomnia
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.token;
  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const accessToken = jwt.verify(token, process.env.SECRET);
      const user = await Users.findById(accessToken.id);
      req.user = user;
      next();
    } else {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    res.status(401).json({ error: "No token attached to header" });
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
