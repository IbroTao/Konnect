const nodemailer = require("nodemailer");
const config = require("../configs/config");
const logger = require("../configs/logger");
const {
  forgetPasswordTemplate,
  updatedPasswordTemplate,
  verifyAccountViaDigitsTemplate,
} = require("../utils/convertMjmlToHtml");

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465;
const transporter = nodemailer.createTransport({
  service: "gmail",
  name: SMTP_HOST,
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: "ghostcodert@gmail.com",
    pass: "vast ffoy hdqi bdqa",
  },
  logger: false,
  debug: true,
});

const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, html: text };
  await transporter.sendMail(msg);
};

const sendResetPasswordEmail = async (name, to, token) => {
  const subject = "Reset Password";
  const resetPasswordUrl = `http://localhost:9090/konnect/reset-password?token=${token}`;
  const text = `Dear ${name}, 
    To rest your password, click on this link: ${resetPasswordUrl}. If you did not request any password resets, then kindly ignore this email or contact our team for more information.`;
  await sendEmail(to, subject, text);
};

const sendVerificationEmail = async (name, to, token) => {
  const subject = "Email Verification";
  const verificationEmailUrl = `http://localhost:9090/konnect/verify-email?token=${token}`;
  const text = `Dear ${name},
    To verify your email, click on this link: ${verificationEmailUrl}
    If you did not create an account, kindly ignore this email or contact our team for more information`;
};

const sendFiveDigitsForVerification = async (to) => {
  const subject = "Verify Your Account";
  const from = `ghoscodert@gmail.com`;
  var mailOptions = {
    from: from,
    to: to,
    subject: `Verify Your Email`,
    html: `<p>oo<p>`,
  };
  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const defaultEmailSender = (to, subject, payload) => {
  const { name, digits, link } = payload;
  let html;

  switch (subject) {
    case "Verify Your Account":
      html = verifyAccountViaDigitsTemplate({ name, digits, link });
      break;
    case "Password Reset":
      html = forgetPasswordTemplate({ name, digits, link });
      break;
    case "Password Updated":
      html = updatedPasswordTemplate({ name, digits, link });
      break;
  }
};
