const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Token is unauthorized" });
  }

  try {
    const payload = jwt.verify(token.split(" ")[1], process.env.SESSION_SECRET);
    console.log(payload);
    const user = await userService.getUserById(payload.sub);
    console.log(user);
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Token expired" });
    }
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }
};

module.exports = {authenticateUser}