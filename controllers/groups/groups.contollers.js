const { Groups } = require("../../models/groups/groups.model");
const myCustomLabels = require("../../utils/labelPaginate");

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
