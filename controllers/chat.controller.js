const { Chats } = require("../models/chat.models");
const { Users } = require("../models/user.models");
const { validateMongoId } = require("../utils/validateMongoId");

// Send Chats
const sendChats = async (req, res) => {
  const { _id } = req.user;
  const { recipientId, chat } = req.body;
  const sender = await Users.findById(_id);
  const recipient = await Users.findById(recipientId);
  try {
    if (!sender || !recipient) {
      return res.status(404).json({ error: "Sender or recipient not found" });
    }

    // new chat
    const newChat = new Chats({
      sender: sender._id,
      recipient: recipient._id,
      chat: chat,
    });
    await newChat.save();

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    throw new Error(error);
  }
};

// Get user chats
const getUserChats = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);

  try {
    const userChats = await Chats.find({
      $or: [{ sender: _id }, { recipient: _id }],
    }).populate("sender recipient", "username");

    res.status(200).json({ userChats });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  sendChats,
  getUserChats,
};
