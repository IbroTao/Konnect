const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, "only admins can make this request")
    );
  }
  next();
};
