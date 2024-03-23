const httpStatus = require("http-status");
const { Notification } = require("../models");
const ApiError = require("../utils/ApiError");
const myCustomLabels = require("../utils/myCustomLabels");

const createNotification = async ({ image, link, message, userId }) => {
  if (!image && !link && !message && !userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "cannot send notification with incomplete fields"
    );
  }
  return Notification.create({
    image,
    link,
    message,
    userId,
  });
};

module.exports = {
  createNotification,
};
