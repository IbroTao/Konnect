const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const { generateToken } = require("../configs/generateToken");
const { Users } = require("../models/user.models");
const crypto = require("crypto");

// Signup new user
const signupUser = async (req, res) => {
  const { email, password, username, mobile } = req.body;
  const findUser = await Users.findOne({ email });
  try {
    if (findUser)
      return res.status(400).json({ message: "User already signed up!" });

    // const verificationToken = crypto.randomBytes(40).toString("hex");

    const user = await Users.create({
      username,
      email,
      mobile,
      password: bcrypt.hashSync(password, 10),
      //verificationToken,
    });

    // await sendVerificationEmail({
    //   name: user.name,
    //   email: user.email,
    //   verificationToken,
    // });
    res.status(201).json({
      message: "User signed up",
      user: user,
      //message: "Verify your email before signing in!",
    });
  } catch (error) {
    throw new Error(error);
  }
};

// Verify user email, then sign up
const verifyAndSignupUser = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await Users.findOne({ email });
  try {
    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    if (user.verificationToken !== verificationToken) {
      res.status(400).json({ message: "Verification failed!" });
    }

    user.isVerified = true;
    user.verifiedAt = Date.now();
    user.verificationToken = null;

    const verifiedUser = await user.save();
    res.status(200).json({ message: "User signed in", user: verifiedUser });
  } catch (error) {
    throw new Error(error);
  }
};

// Login User after been email verified
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found! try logging in" });
    }

    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      res.status(400).json({ error: "Incorrect password" });
    }

    // if (!user.isVerified) {
    //   res.status(400).json({ message: "Please verify your email" });
    // }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 120 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "User logged in!", user });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  signupUser,
  loginUser,
  verifyAndSignupUser,
  logoutUser,
};
