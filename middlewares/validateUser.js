const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const ApiError = require("../utils/ApiError");
const { userService } = require("../services");

const validateAccount = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token)
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, "provide a valid token header")
    );

  if (typeof token !== "string") {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, "provide a valid token type")
    );
  }

  const tokenJWT = token.split(" ");
  if (tokenJWT[0] !== "Bearer") {
    return next(
      ApiError(httpStatus.UNAUTHORIZED, "provide a valid bearer token")
    );
  }
  try {
    const payload = jwt.verify(tokenJWT[1], config.jwt.secret);
    const user = await userService.returnUserData(payload.sub);
    if (!user.isEmailVerified)
      return next(ApiError(httpStatus.UNAUTHORIZED, "verify email first"));
    req.user = user;
    next();
  } catch (e) {
    next(ApiError(httpStatus.SERVICE_UNAVAILABLE, e.message));
  }
};

module.exports = validateAccount;
