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

const saveManyNotifications = async (data) => {
  if (!data.length)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "notifications can not be null"
    );
  return Notification.insertMany(data);
};

const findAllNotifications = async (userId, limit, page, orderBy, sortedBy) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const notifications = await Notification.paginate(
    {
      userId,
    },
    {
      ...(limit ? { limit } : { limit: 10 }),
      page,
      sort: { [orderBy]: sortedBy === "asc" ? 1 : -1 },
      ...options,
    }
  );
  return notifications;
};

const findOneNotification = async (notificationId) => {
  return Notification.findOne({ _id: notificationId }).lean();
};

const deleteOneNotification = async (notificationId) => {
  return Notification.deleteOne({ _id: notificationId });
};

const updateNotification = async (notificationId) => {
  return Notification.updateOne({ _id: notificationId }, { isSeen: true });
};

const setNotificationAsSeen = async (userId) => {
  return Notification.updateMany({ _id: userId }, { isSeen: true });
};

module.exports = {
  createNotification,
  updateNotification,
  saveManyNotifications,
  findAllNotifications,
  deleteOneNotification,
  findOneNotification,
  setNotificationAsSeen,
};
