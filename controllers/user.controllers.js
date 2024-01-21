const { Users } = require("../models/user.models");
const { compareSync, hashSync } = require("bcryptjs");
const {
  sendPasswordResetTokenEmail,
} = require("../utils/sendPasswordResetEmail");
const { validateMongoId } = require("../utils/validateMongoId");
const crypto = require("crypto");

// Update User Details
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

// Send Password Reset Token to the User Email
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

// Update Password after getting Password Reset Token through email
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

// Update user password without email
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

// Delete user through their id
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

// Get a user through his/her id
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

// Find and fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find()
      .sort({
        createdAt: "desc",
      })
      .populate("username email");
    res.status(200).json({ users });
  } catch (error) {
    throw new Error(error);
  }
};

// Block user through their id
const blockUser = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const user = await Users.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    ).select(["-password"]);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User has been blocked", user });
  } catch (error) {
    throw new Error(error);
  }
};

// Unblock user through their id
const unblockUser = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const user = await Users.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    ).select(["-password"]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User has been unblocked", user });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  updateUserDetails,
  deleteUser,
  updatePassword,
  updatePasswordViaEmail,
  sendResetPasswordTokenViaEmail,
  getSingleUser,
  getAllUsers,
  blockUser,
  unblockUser,
};
