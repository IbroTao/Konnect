const nodemailer = require("nodemailer");
require("dotenv").config();

const sender = process.env.SENDER;
const emailPass = process.env.PASS;

const sendEmail = async ({ to, subject, html }) => {
  const transporter = await nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: sender,
      pass: emailPass,
    },
    secure: true,
  });

  return await transporter.sendMail({
    from: sender,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async ({ name, email, verificationToken }) => {
  const message = `<p>Please confirm your email b clicking on the following link: <a href="https://localhost:9090/api/auth/verify-email?token=${verificationToken}"></p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = { sendVerificationEmail };
