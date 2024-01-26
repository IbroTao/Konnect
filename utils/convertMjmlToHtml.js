const mjml = require("mjml");
const { resolve } = require("path");
const { readFileSync } = require("fs");
const { compile } = require("handlebars");

const verifyAccountViaDigits = readFileSync(
  resolve(__dirname, "../templates/verify-account.mjml")
).toString();
const forgetPassword = readFileSync(
  resolve(__dirname, "../templates/forget-password.mjml")
).toString();
const updatedPassword = readFileSync(
  resolve(__dirname, "../templates/password-changed.mjml")
).toString();

const verifyAccountViaDigitsTemplate = compile(
  mjml(verifyAccountViaDigits).html
);
const forgetPasswordTemplate = compile(mjml(forgetPassword).html);
const updatedPasswordTemplate = compile(mjml(updatedPassword).html);

module.exports = {
  verifyAccountViaDigitsTemplate,
  forgetPasswordTemplate,
  updatedPasswordTemplate,
};
