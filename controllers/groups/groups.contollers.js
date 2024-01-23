const { Groups } = require("../../models/groups/groups.model");
const myCustomLabels = require("../../utils/labelPaginate");
const { validateMongoId } = require("../../utils/validateMongoId");
const { notificationQueue } = require("../../schemas/notificationQueue");

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
    if (!groups) {
      res.status(404).json({ error: "Groups not found" });
    }

    res.status(200).json(groups);
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

const updateGroupRulesAndTypes = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    let group;

    if (req.body.rules && req.body.type) {
      group = await Groups.findByIdAndUpdate(
        id,
        {
          rules: req.body.rules,
          type: req.body.type,
        },
        {
          new: true,
        }
      );
    } else if (req.body.rules) {
      group = await Groups.findByIdAndUpdate(
        id,
        {
          rules: req.body.rules,
        },
        {
          new: true,
        }
      );
    } else if (req.body.type) {
      group = await Groups.findByIdAndUpdate(
        id,
        {
          type: req.body.type,
        },
        {
          new: true,
        }
      );
    }
    if (!group) {
      res.status(404).json({ error: "group not found" });
    }
    res.status(200).json({ message: "group rules and type updated", group });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getGroupById = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const group = await Groups.findById(id);
    if (!group) {
      res.status(404).json({ error: "group not found" });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addMember = async (req, res) => {
  const { member } = req.body;
  const { id } = req.params;
  validateMongoId(id);
  try {
    const group = await Groups.findByIdAndUpdate(id, {
      $addToSet: { members: { id: member } },
      $inc: { membersCount: 1 },
    });

    if (!group) {
      res.status(404).json({ error: "group not found" });
    }

    res
      .status(200)
      .json({ message: "You have been added as a member of this group" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const addAdmin = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const { admin } = req.body;
  const admins = [];
  try {
    admin.map((id) => {
      admins.push({ id });
    });

    const group = await Groups.findByIdAndUpdate(id, {
      $push: { admins },
      $inc: { adminCount: admins.length },
    });

    if (!group) {
      res.status(404).json({ error: "group not found" });
    }

    const notificationData = [];
    admin.forEach((admin) => {
      notificationQueue.msg = `You have been made an admin in ${group.name}`;
      notificationQueue.link = `http:localhost:9090/api/groups/${group._id}`;
      (notificationQueue.type = "role-assign"),
        (notificationQueue.timestamps = new Date().toISOString),
        (notificationQueue.recipientId = admin);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createGroup,
  queryGroups,
  updateGroupInfo,
  updateGroupRulesAndTypes,
  getGroupById,
  addMember,
};
