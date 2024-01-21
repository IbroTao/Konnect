const {
  GroupMessages,
  GroupPosts,
  Groups,
} = require("../models/groups.models");
const { Users } = require("../models/user.models");
const { validateMongoId } = require("../utils/validateMongoId");

// Create Group
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

// Edit Group Details (Admin only)
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

const addMembers = async (req, res) => {
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
    group.members.push(_id);

    if (!group.admin) {
      group.admin = userId;
    }
    const savedGroup = await group.save();
    res.status(200).json({
      message: "Member added",
      savedGroup,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const userGroup = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const group = await Groups.findById(req.params.id);
    if (!group) {
      res.status(404).json({ message: "Group not found!" });
    }

    const user = await Users.findById(_id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    user.groups = [group._id];
    await user.save();
    return user.groups;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllMembers = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const group = await Groups.findById(id).populate(
      "members",
      "username email"
    );
    if (!group) {
      res.status(404).json({ error: "Group not found" });
    }

    return group.members;
  } catch (error) {
    throw new Error(error);
  }
};

const makeAdmin = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const group = await Groups.findById(req.params.groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(_id)) {
      res.status(400).json({ message: "User is not a member of the group" });
    }

    group.admin = _id;
    await group.save();

    res.status(200).json({ message: "You have added this member as an admin" });
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
      return res.status(400).json({ error: "Post failed to updated" });
    }

    if (!post.isApproved) {
      return res.status(404).json({ error: "Post has not been approved" });
    }

    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    throw new Error(error);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await GroupPosts.findByIdAndDelete(id);
    if (!post) {
      return res.status(400).json({ error: "Post failed to be deleted" });
    }

    if (!post.isApproved) {
      return res.status(404).json({ error: "Post has not been approved" });
    }

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    throw new Error(error);
  }
};

const getSinglePost = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await GroupPosts.findById(id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }

    if (!post.isApproved) {
      return res.status(404).json({ error: "Post has not been approved" });
    }

    res.status(200).json({ post });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await GroupPosts.find().sort({
      createdAt: "desc",
    });
    if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
    }

    if (!posts.isApproved) {
      return res.status(404).json({ error: "Post has not been approved" });
    }

    res.status(200).json({ posts });
  } catch (error) {
    throw new Error(error);
  }
};

const approvePost = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await GroupPosts.findByIdAndUpdate(
      id,
      {
        isApproved: true,
      },
      {
        new: true,
      }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ mesage: "Post has been approved" });
  } catch (error) {
    throw new Error(error);
  }
};

const likePost = async (req, res) => {
  const { postId } = req.body;
  validateMongoId(postId);
  try {
    const post = await GroupPosts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.isApproved) {
      return res.status(404).json({ error: "Post has not been approved" });
    }

    const userId = req.user._id;
    const isLiked = post.likes.find(
      (Id) => Id.toString() === userId.toString()
    );

    if (isLiked) {
      const post = await GroupPosts.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json({ post, totalLikes: post.length });
    } else {
      const post = await GroupPosts.findByIdAndUpdate(
        postId,
        {
          $push: { likes: userId },
          isLiked: true,
        },
        {
          new: true,
        }
      );
      res.status(200).json({ post, totalLikes: post.length });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const addComments = async (req, res) => {
  const { _id } = req.user;
  const { postId, comment } = req.body;
  try {
    const post = await GroupPosts.findById(postId);
    let alreadyComment = post.comments.find(
      (userId) => userId.toString() === _id.toString()
    );
    if (alreadyComment) {
      const comment = await GroupPosts.updateOne(
        {
          comments: { $elemMatch: alreadyComment },
        },
        {
          $set: { "comments.$.comment": comment, "comments.$.commenter": _id },
        },
        {
          new: true,
        }
      );
      res.status(200).json({ comment });
    } else {
      const comment = await GroupPosts.findByIdAndUpdate(
        postId,
        {
          $push: {
            comments: {
              comment: comment,
              commenter: _id,
            },
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json({ comment });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const suspendMembers = async (req, res) => {
  const { _id } = req.user;
  const { groupId } = req.params;
  validateMongoId(_id);
  try {
    const group = await Groups.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!group.members.includes(_id)) {
      return res
        .status(400)
        .json({ error: "User is not a member of the group" });
    }

    const memberIndex = group.members.indexOf(_id);

    group.members[memberIndex].isSuspended = true;

    await group.save();

    res.status(200).json({ message: "User has been suspended" });
  } catch (error) {}
};

const sendMessage = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  const { recipientId, message } = req.body;
  const sender = await Users.findById(_id);
  const recipient = await Users.findById(recipientId);
  try {
    if (!sender || !recipient) {
      return res
        .status(404)
        .json({ message: "Sender and recipient not found " });
    }

    const newMessage = new GroupMessages({
      sender: sender._id,
      recipient: recipient._id,
      message: message,
    });
    await newMessage.save();

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    throw new Error(error);
  }
};

const getGroupMessages = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const memberMessages = await GroupMessages.find({
      $or: [{ sender: _id }, { recipient: _id }],
    }).populate("sender recipient", "username");

    res.status(200).json({ memberMessages });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createGroup,
  editGroupDetails,
  addMembers,
  getAllMembers,
  deleteGroup,
  createPost,
  editPost,
  makeAdmin,
  deletePost,
  getSinglePost,
  getAllPosts,
  approvePost,
  likePost,
  addComments,
  suspendMembers,
  sendMessage,
  getGroupMessages,
};
