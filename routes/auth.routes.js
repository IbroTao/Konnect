const express = require("express");
//const passport = require("passport");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const modelNames = require("../constants/modelNames");
//const validateAccount = require("../middlewares/validateUser");

const router = express.Router();

/**
 * @openapi
 * /register:
 *  get:
 *    tag:
 *     - Registration
 *     description: Register a new user
 *     responses:
 *        200:
 *          description: Registration of new user onboard
 */

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

/**
 * @swagger
 * /auth/login
 *  post:
 *    summary: Log in a registered user
 *    description: Log in a registered user with the required details or information
 *    tags:
 *     - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref:
 *     responses:
 */

router.post("/login", validate(authValidation.login), authController.login);

router.post(
  "/verify-email",
  validate(authValidation),
  authController.sendVerificationEmail
);

router.post(
  "/verify-otp",
  validate(authValidation.validateAcct),
  authController.verifyAccount
);

router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

router.post(
  "/resend-verification-code",
  validate(authValidation.email),
  authController.resendVerificationCode
);

module.exports = router;
