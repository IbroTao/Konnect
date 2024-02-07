const modelNames = require("../constants/modelNames");
const { Groups, GroupMsg } = require("../models");

const initiateGroup = async (data) => {
  const group = await Groups.create(data);
  return group;
};

const updateGroupById = async (id, data, options) => {
  const group = await Groups.findByIdAndUpdate(id, data, options);
  return group;
};

const deleteGroup = async (id) => {
  return Groups.findByIdAndDelete(id);
};

const findGroupById = async (id) => {
  const group = await Groups.findById(id)
    .populate("members", "name avatar username")
    .populate("admins", "name avatar username")
    .populate("muteIds", "name avatar username")
    .populate("blockIds", "name avatar username");
  return group;
};

const findGroupByName = async (name, userId) => {
  const group = await Groups.findOne({
    $and: [
      { name: { $regex: name, $options: "i" } },
      { $in: { members: userId } },
    ],
  })
    .populate("members", "name avatar username")
    .populate("admins", "name avatar username")
    .populate("muteIds", "name avatar username")
    .populate("blockIds", "name avatar username");
  return group;
};

const blockUsers = async (id, usersId) => {
  const group = await Groups.findByIdAndUpdate(id, {
    $addToSet: { blockIds: usersId },
  });
  return group;
};

const unblockUsers = async (id, usersId) => {
  const group = await Groups.findByIdAndUpdate(id, {
    $pull: { blockIds: usersId },
  });
  return group;
};

const postMessage = async (data) => {
  const msg = await GroupMsg.create(data);
  return msg;
};

module.exports = {
  initiateGroup,
  updateGroupById,
  deleteGroup,
  postMessage,
  findGroupById,
  findGroupByName,
  blockUsers,
  unblockUsers,
};
