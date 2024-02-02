const myCustomLabels = require("../../utils/myCustomLabels");
const { Group, groupRequest } = require("../../models");

const createGroup = async (data) => {
  const group = await Group.create(data);
  return group;
};

const getAGroupById = async (id) => {
  const group = await Group.findById(id);
  return group;
};

module.exports = {
  createGroup,
  getAGroupById,
};
