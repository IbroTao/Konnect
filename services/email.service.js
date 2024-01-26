const nodemailer = require("nodemailer");
const config = require('../configs/config');
const logger = require('../configs/logger');
const {forgetPasswordTemplate, updatedPasswordTemplate, verifyAccountViaDigitsTemplate} = require('../utils/convertMjmlToHtml');

const SMTP_HOST = 'smtp.gmail.com';
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
  debug: true
});

const sendEmail = async(to, subject, text) => {
    const msg = {from: config.email.from, to, subject, html: text};
    await transporter.sendMail(msg) 
};

const sendResetPasswordEmail = async(name, to, token) => {
    const subject = 'Reset Password';
    const resetPasswordUrl = `http:localhost:9090/konnect/reset-password?token=${token}`,
    const text = `Dear ${name}, To rest your password, click on this link: ${resetPasswordUrl}. If you did not request any password resets, then kindly ignore this email or contact our team for more information.`;
    await sendEmail(to, subject, text)
}