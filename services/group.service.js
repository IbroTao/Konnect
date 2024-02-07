const modelNames = require("../constants/modelNames");
const { Groups, GroupMsg } = require("../models");

const initiateGroup = async (data) => {
  const group = await Groups.create(data);
  return group;
};

const updateGroupById = async (id) => {
  const group = await Groups.findByIdAndUpdate(id);
  return group;
};

module.exports = {
  initiateGroup,
  updateGroupById,
};
