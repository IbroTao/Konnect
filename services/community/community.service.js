const myCustomLabels = require("../../utils/myCustomLabels");
const { Community, CommunityRequest } = require("../../models");

const createCommunity = async (data) => {
  const community = await Community.create(data);
  return community;
};

const getACommunityById = async (id) => {
  const community = await Community.findById(id);
  return community;
};

const getCommunityByName = async (name) => {
  const community = await Community.findOne({ name });
  return community;
};

const getMembers = async (id) => {
  const members = await Community.findById(id)
    .populate("members.id", "avatar name username _id")
    .populate("admins.id", "avatar name username _id")
    .select(["members", "admins", "name"])
    .lean();
  return members;
};

const queryCommunities = async (
  { search, filter },
  { page, limit, orderBy, sortedBy }
) => {
  const options = {
    lean: true,
  };

  const communities = await Community.paginate(
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
  return communities;
};

const updateCommunity = async (id, data, opts) => {
  const community = await Community.findByIdAndUpdate(id, data, opts);
  return community;
};

const uploadImage = async (id, url, publicId) => {
  const community = await Community.updateOne(
    { _id: id },
    { coverImage: url, publicId }
  );
  return community;
};

const deleteCommunity = async (id) => {
  const community = await Community.findOneAndDelete({ _id: id });
  return community;
};

const sendRequestTo = async (userId, communityId) => {
  const community = await Community.findOne({ _id: communityId });
  if (community.type === "public")
    throw new Error("you cannot send a request to a public community");

  await CommunityRequest.requestModel({
    userId,
    communityId,
  });
  return community;
};

const deleteRequest = async (id) => {
  return CommunityRequest.deleteOne({ _id: id });
};

const getAllRequests = async ({ id, limit, page }) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const requests = await CommunityRequest.paginate(
    { communityId: id },
    {
      ...(limit ? { limit } : { limit: 15 }),
      page,
      sort: "asc",
      populate: {
        path: "userId",
        select: "avatar name username totalFollowers totalFollowings createdAt",
      },
      ...options,
    }
  );
  return requests;
};

module.exports = {
  createCommunity,
  getACommunityById,
  getCommunityByName,
  getMembers,
  queryCommunities,
  updateCommunity,
  uploadImage,
  deleteCommunity,
  sendRequestTo,
  deleteRequest,
  getAllRequests,
};
