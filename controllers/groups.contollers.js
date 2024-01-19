const {
  GroupMessages,
  GroupPosts,
  Groups,
} = require("../models/groups.models");
const { validateMongoId } = require("../utils/validateMongoId");

const createGroup = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const group = await Groups.create({
      name: req.body.name,
      description: req.body.description,
      admin: _id,
      createdBy: _id,
    });
    res.status(201).json({ message: "Group created", group });
  } catch (error) {
    throw new Error(error);
  }
};

const editGroupDetails = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const group = await Groups.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      description: req.body.description,
    },
    {
      new: true,
    }
  );
  try {
    if (!group) {
      res.status(404).json({ message: "Group not found or deleted!" });
    }

    res.status(200).json({ message: "Group details updated", group });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createGroup,
  editGroupDetails,
};
