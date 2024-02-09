const nodemailer = require("nodemailer");
const config = require("../configs/config");
const logger = require("../configs/logger");
const { uniqueSixDigits } = require("../utils/generateSixDigits");
const {
  forgetPasswordTemplate,
  updatedPasswordTemplate,
  verifyAccountViaDigitsTemplate,
} = require("../utils/convertMjmlToHtml");

const sender = process.env.SMTP_NAME;
const emailPass = process.env.SMTP_PASSWORD;
const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465;

const transport = nodemailer.createTransport({
  service: "gmail",
  name: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: sender,
    pass: emailPass,
  },
  logger: false,
  debug: true,
});

// const sendEmail = async ({ to, subject, html }) => {
//   const transporter = nodemailer.createTransport({
//     port: SMTP_PORT,
//     host: SMTP_HOST,
//     auth: {
//       user: sender,
//       pass: process.env.SMTP_PASSWORD,
//     },
//     secure: true,
//   });

//   return await transporter.sendMail({
//     from: sender,
//     to,
//     subject,
//     html,
//   });
// };

const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, html: text };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token, name) => {
  const subject = "Reset Password";
  const resetPasswordLink = `http://localhost:9090/konnect/reset-password?token=${token}`;
  const text = `Dear ${name}
To reset your password, click on this link: ${resetPasswordLink}
If you did not request to change your password, then ignore this email.`;
  await sendEmail(to, subject, text);
};
// const sendResetPasswordEmail = async ({ name, token }) => {
//   const resetPasswordUrl = `http://localhost:9090/konnect/reset-password?token=${token}`;
//   const text = `To reset your password, click on this link: ${resetPasswordUrl}. If you did not request any password resets, then kindly ignore this email or contact our team for more information.`;

//   return sendEmail({
//     to: email,
//     subject: "Reset Password",
//     html: `<h4>Dear, ${name}</h4> ${text}`,
//   });
// };

const sendVerificationEmail = async (name, to, token) => {
  const subject = "Email Verification";
  const verificationEmailUrl = `http://localhost:9090/konnect/verify-email?token=${token}`;
  const text = `Dear ${name}
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email`;
};

// const getVerificationCode = async ({ email, name }) => {
//   const digits = uniqueSixDigits();
//   const text = `Thanks creating an account with us at Konnect.
//   To continue registration, we sent a 6-digits code to you for further verification and authentication.

//   Your 6-digit code is <h4>${digits}</h4>

//   Kindly enter the code into your device to continue the registration process. For any help, you can contact us at Konnect.

//   Best Wishes,
//   @KonnectICT`;

//   return sendEmail({
//     to: email,
//     subject: "Account Verification",
//     html: `<h4>Dear ${name}</h4> ${text}`,
//   });
// };

// const sendVerificationEmail = async ({ name, token }) => {
//   const verificationEmailUrl = `http://localhost:9090/konnect/verify-email?token=${token}`;
//   const text = `To verify your email, click on this link: ${verificationEmailUrl}
//   If you did not create an account, kindly ignore this email or contact our team for more information`;

//   return sendEmail({
//     to: email,
//     subject: "Verify Your Account",
//     html: `<h4>Dear ${name}</h4> ${text}`,
//   });
// };

const sendFiveDigitsForVerification = async (to) => {
  const subject = "Verify Your Account";
  const from = `ghostcodert@gmail.com`;
  var mailOptions = {
    from: from,
    to: to,
    subject: `Please verify your account`,
    text: `Dear User`,
    html: `<p>oo</p>`,
  };
  try {
    transport.sendMail(mailOptions, function (error, info) {
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

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendFiveDigitsForVerification,
  defaultEmailSender,
};
