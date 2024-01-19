const { hashSync, compareSync } = require("bcryptjs");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const { Users } = require("../models/user.models");
const crypto = require("crypto");

const signupUser = async (req, res) => {
  const { email, password, username, mobile } = req.body;
  const findUser = await Users.findOne({ email });
  try {
    if (findUser)
      return res.status(400).json({ message: "User already signed up!" });

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const user = await Users.create({
      username,
      email,
      password: hashSync(password, 10),
      verificationToken,
    });

    await sendVerificationEmail({
      name: user.name,
      email: user.email,
      verificationToken,
    });
    res.status(201).json({
      message: "Verify your email before signing in!",
    });
  } catch (error) {
    throw new Error(error);
  }
};

const verifyEmailAndSignIn = async (req, res) => {
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

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please provide email and password" });
  }

  const user = await Users.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found! try logging in" });
  }

  const comparePassword = compareSync(password, user.password);
  try {
  } catch (error) {
    throw new Error(error);
  }
};
