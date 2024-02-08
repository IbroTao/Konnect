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

const markMsgDeleted = async (id) => {
  const msg = await GroupMsg.findByIdAndUpdate(id, {
    $set: { isDeleted: true },
  });
  return msg;
};

const addMembers = async (id, members) => {
  const group = await Groups.findByIdAndUpdate(id, { $addToSet: { members } });
  return group;
};

const removeMembers = async (id, members) => {
  const group = await Groups.findByIdAndUpdate(id, {
    $pull: { members: { $in: members } },
  });
  return group;
};

const addAdmins = async (id, admins) => {
  const group = await Groups.findByIdAndUpdate(id, { $addToSet: { admins } });
  return group;
};

const removeAdmins = async (id, admins) => {
  const group = await Groups.findByIdAndUpdate(id, {
    $pull: { admins: { $in: admins } },
  });
  return group;
};

const markMsgRead = async (groupId, userId) => {
  const msg = await GroupMsg.updateMany(
    { groupId, "readBy.userId": { $ne: userId } },
    { $addToSet: { readBy: { userId } } }
  );
  return msg;
};

const getMsgById = async (msgId) => {
  const msg = await GroupMsg.findById(msgId);
  return msg;
};

const getMsgsByGroupId = async (filter, options) => {
  return GroupMsg.paginate({ ...filter }, { ...options });
};

const checkIfUserIsAMember = async (userId, groupId) => {
  const group = await Groups.findOne({
    _id: groupId,
    members: { $in: userId },
  });
  return group;
};

const getGroupsByUserId = async (userId) => {
  const groups = await Groups.find({ members: { $in: userId } });
  return groups;
};

const reportMessage = async (reporter, reportedMsg, groupId, reason) => {
  const report = await GroupReport.create({
    groupId,
    reporterId: reporter,
    reason,
    reportedMsg,
  });
  return report;
};

const getReportedMsg = async (reportId) => {
  const report = await GroupReport.findById(reportId)
    .populate("reporterId", "name avatar")
    .populate("reportedMsg")
    .populate("groupId");
  return report;
};

module.exports = {
  initiateGroup,
  updateGroupById,
  markMsgDeleted,
  getReportedMsg,
  getMsgsByGroupId,
  reportMessage,
  markMsgRead,
  getMsgById,
  getGroupsByUserId,
  checkIfUserIsAMember,
  addAdmins,
  removeAdmins,
  addMembers,
  removeMembers,
  deleteGroup,
  postMessage,
  findGroupById,
  findGroupByName,
  blockUsers,
  unblockUsers,
};
