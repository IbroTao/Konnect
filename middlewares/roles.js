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

const adminPermitter = (permissions) => {
  return (req, res, next) => {
    const permissionRights = req.user.permissions;
    if (!permissions.every((value) => permissionRights.includes(value))) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "you don't have permission to make this request"
        )
      );
    }
    next();
  };
};

const ageCheck = (req, res, next) => {
  const currentDate = new Date();
  const age = currentDate.getFullYear() - req.user.dob.getFullYear();
  if (age < 16) {
    return next(
      new ApiError(
        httpStatus.FORBIDDEN,
        "you cannot access this data due to age restriction"
      )
    );
  }
  next();
};

module.exports = {
  isAdmin,
  adminPermitter,
  ageCheck,
};
