const nodemailer = require("nodemailer");
require("dotenv").config();

const sender = process.env.SENDER;
const emailAccess = process.env.PASS;

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: sender,
      pass: emailAccess,
    },
  });

  return await transporter.sendMail({
    from: sender,
    to,
    subject,
    html,
  });
};

const sendPasswordResetTokenEmail = async ({ name, token }) => {
  const resetLink = `https://localhost:9090/api/user/reset-password/${token}`;
  const message = `<p>Please reset your password by clicking on the following link: <a href="${resetLink}"><p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password Link",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = { sendPasswordResetTokenEmail };
