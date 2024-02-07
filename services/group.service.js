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

module.exports = {
  initiateGroup,
  updateGroupById,
  deleteGroup,
  findGroupById,
};
