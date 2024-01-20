const {
  GroupMessages,
  GroupPosts,
  Groups,
} = require("../models/groups.models");
const { Users } = require("../models/user.models");
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

const deleteGroup = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const group = await Groups.findByIdAndDelete(id);
  try {
    if (!group) {
      res.status(404).json({ message: "Group not found or already deleted!" });
    }

    res.status(200).json({ message: "Group deleted!" });
  } catch (error) {
    throw new Error(error);
  }
};

const joinGroup = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const group = await Groups.findById(req.params.id);
    if (!group) {
      res.status(404).json({ message: "Group not found or deleted!" });
    }

    const user = await Users.findById(_id);
    if (!user) {
      res.status(404).json({ message: "User not found or deleted" });
    }
    user.groups = [group._id];
    const newUser = await user.save();
    res.status(201).json({
      message: `${user.username} has joined ${group.name} successfully`,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getUserGroups = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);

  const user = await Users.findById(_id);
  try {
    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    const groupId = user.groups;
    const groups = await Groups.find({ groupId }).select([
      "_id",
      "name",
      "description",
      "admin",
      "createdAt",
      "updatedAt",
    ]);

    const admin = await Users.findById(groups.admin).select(["username"]);
    const data = {
      groups,
      admin,
    };
    res.status(200).json({ data });
  } catch (error) {
    throw new Error(error);
  }
};

const makeAdmin = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const admin = await Groups.findByIdAndUpdate();
  } catch (error) {
    throw new Error(error);
  }
};

const createPost = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  const file = req.file;
  try {
    const user = await Users.findOne({ _id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await GroupPosts.create({
      image: `assets/images/${file.originalname}`,
      caption: req.body.caption,
      postedBy: user._id,
    });
    if (!post) {
      res.status(400).json({ error: "Post failed to be created" });
    }

    res.status(200).json({ message: "Post created", post });
  } catch (error) {
    throw new Error(error);
  }
};

const editPost = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const file = req.file;
  try {
    const post = await GroupPosts.findByIdAndUpdate(
      id,
      {
        image: `assets/images/${file.originalname}`,
        caption: req.body.caption,
      },
      {
        new: true,
      }
    );

    if (!post) {
      return res.status(400).json({ error: "Post failed to update" });
    }

    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    throw new Error(error);
  }
};

const deletePost = async (req, res) => {};

module.exports = {
  createGroup,
  editGroupDetails,
  joinGroup,
  deleteGroup,
};
