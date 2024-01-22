const { Groups } = require("../../models/groups/groups.model");
const myCustomLabels = require("../../utils/labelPaginate");
const { validateMongoId } = require("../../utils/validateMongoId");

const createGroup = async (req, res) => {
  try {
    const { body } = req;
    const isNameTaken = await Groups.findOne(body.name);
    if (isNameTaken) {
      return res.status(400).json({ error: "name already taken" });
    }

    const group = await Groups.create({
      ...body,
      admins: { id: [req.user._id] },
      adminCount: 1,
    });

    if (!group) {
      return res.status(400).json({ error: "Failed to create" });
    }

    res.status(201).json({ message: "Group created" });
  } catch (error) {
    res.status(400).json({ error: "request unsuccessful" });
  }
};

const queryGroups = async (req, res) => {
  const { search, limit, page, filter, sortedBy, orderBy } = req.query;
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };
  try {
    const groups = await Groups.paginate(
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
        populate: { path: "admins.id", select: "_id username" },
      }
    );
    return groups;
    if (!groups) {
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateGroupInfo = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const group = await Groups.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!group) {
      res.status(404).json({ error: "no group found" });
    }

    res.status(200).json({ message: "group info updated", group });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createGroup,
  queryGroups,
  updateGroupInfo,
};
