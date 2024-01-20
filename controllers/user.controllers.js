const { Users } = require("../models/user.models");
const { compareSync, hashSync } = require("bcryptjs");
const {
  sendPasswordResetTokenEmail,
} = require("../utils/sendPasswordResetEmail");
const { validateMongoId } = require("../utils/validateMongoId");
const crypto = require("crypto");

const updateUserDetails = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const user = await Users.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!user) {
      res.status(400).json({ message: "Failed to update!" });
    }

    res.status(200).json({ message: "User details updated successfully!" });
  } catch (error) {
    throw new Error(error);
  }
};

const sendResetPasswordTokenViaEmail = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email }).select(["-password"]);
  if (!user) {
    res.status(404).json({ message: "User not found!" });
  }

  const resetToken = crypto.randomBytes(70).toString("hex");

  await sendPasswordResetTokenEmail({
    name: user.name,
    token: resetToken,
  });

  user.passwordChangedAt = Date.now();
  user.passwordResetToken = createHash(resetToken);
  user.passwordResetTokenExpiresAt = Date.now() * 1000 * 60 * 10;
  const newUser = await user.save();

  res.status(200).json({
    message: "Check your email inbox to reset your password",
    user: newUser,
  });
};

const updatePasswordViaEmail = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const user = await Users.findOne({
    passwordResetToken: token,
    passwordResetTokenExpiresAt: { $gt: Date.now() },
  });
  try {
    if (!user) {
      res.status(400).json({ message: "Token expired" });
    }

    user.password = hashSync(password, 10);
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;
    const newUser = await user.save();

    res.status(200).json({ message: "Password updated successfully", newUser });
  } catch (error) {
    throw new Error(error);
  }
};

const updatePassword = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({ _id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const verifyPassword = compareSync(user.password, oldPassword);
    if (!verifyPassword) {
      res.status(400).json({ message: "Wrong Password! Failed to update" });
    }

    user.password = hashSync(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const user = await Users.findByIdAndDelete(_id);
    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    throw new Error(error);
  }
};

const getSingleUser = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const user = await Users.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().sort({
      createdAt: "desc",
    });
    res.status(200).json({ users });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  updateUserDetails,
  deleteUser,
  updatePassword,
  updatePasswordViaEmail,
  sendPasswordResetTokenEmail,
  getSingleUsers,
  getAllUsers,
};
