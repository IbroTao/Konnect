const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { MESSAGES } = require("../../constants/responseMessages");
const { uploadSingle, deleteSingle } = require("../../libs/cloudinary");
const { groupService, notificationInfo } = require("../../services");

const createGroup = catchAsync(async (req, res) => {
  const { body } = req;
  const isName = await groupService.getGroupByName(body.name);
  if (isName) throw new ApiError(httpStatus.BAD_REQUEST, "name already taken");

  await groupService.createGroup({
    ...body,
    admins: { id: [req.user._id] },
    adminCount: 1,
  });
  if (!body)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(201).json({ message: MESSAGES.SUCCESS });
});

const queryGroups = catchAsync(async (req, res) => {
  const { search, limit, page, filter, sortedBy, orderBy } = req.query;
  const groups = await groupService.queryGroups(
    { search, filter },
    { page, limit, orderBy, sortedBy }
  );
  if (!groups)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.RESOURCE_MISSING
    );
  res.status(200).json(groups);
});

module.exports = {
  createGroup,
  queryGroups,
};
