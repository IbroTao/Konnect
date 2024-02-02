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

const getGroupByName = async (name) => {
  const group = await Group.findOne({ name });
  return group;
};

const getMembers = async (id) => {
  const members = await Group.findById(id)
    .populate("members.id", "avatar name username _id")
    .populate("admins.id", "avatar name username _id")
    .select(["members", "admins", "name"])
    .lean();
  return members;
};

const queryGroups = async (
  { search, filter },
  { page, limit, orderBy, sortedBy }
) => {
  const options = {
    lean: true,
  };

  const groups = await Group.paginate(
    {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { info: { $regex: search, $options: "i" } },
      ],
      ...filter,
    },
    {
      ...(limit ? { limit } : { limit: 5 }),
      page,
      sort: { [orderBy]: sortedBy === "asc" ? 1 : -1 },
      ...options,
      populate: { path: "admins.id", select: "_id username avatar name" },
    }
  );
  return groups;
};

const updateGroup = async (id, data, opts) => {
  const group = await Group.findByIdAndUpdate(id, data, opts);
  return group;
};

const uploadImage = async (id, url, publicId) => {
  const group = await Group.updateOne(
    { _id: id },
    { coverImage: url, publicId }
  );
  return group;
};

const deleteGroup = async (id) => {
  const group = await Group.findOneAndDelete({ _id: id });
  return group;
};

const sendRequestTo = async (userId, groupId) => {
  const group = await Group.findOne({ _id: groupId });
  if (group.type === "public")
    throw new Error("you cannot send a request to a public group");

  await groupRequest.create({
    userId,
    communityId,
  });
  return group;
};

module.exports = {
  createGroup,
  getAGroupById,
  getGroupByName,
  getMembers,
  queryGroups,
  updateGroup,
  uploadImage,
  deleteGroup,
  sendRequestTo,
};
