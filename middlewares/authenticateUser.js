const jwt = require("jsonwebtoken");
const { userService } = require("../services");
const httpStatus = require("http-status");

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

module.exports = { authenticateUser };
