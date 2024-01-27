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
};
