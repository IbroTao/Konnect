const { hashSync } = require("bcryptjs");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const { Users } = require("../models/user.models");
const crypto = require("crypto");

const signupUser = async (req, res) => {
  try {
    const { email, password, username, mobile } = req.body;
    const findUser = await Users.findOne({ email });
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
  try {
    const { verificationToken, email } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    if (user.verificationToken !== verificationToken) {
      res.status(400).json({ message: "Verification failed!" });
    }

    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = null;

    const verifiedUser = await user.save();
    res.status(200).json({ message: "User signed in" });
  } catch (error) {
    throw new Error(error);
  }
};
