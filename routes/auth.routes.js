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
 * /auth/register:
 *  post:
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
 * /konnect/auth/profile:
 *  get:
 *    summary: Fetch user profile details
 *    description: Fetch profile details of a user
 *    tags:
 *      - Profile
 *    responses:
 *      '200':
 *        description: User profile fetched successfully
 *      '400':
 *        description: Unable to fetch user profile data
 */
router.get("/profile", (req, res) => {
  const demoUser = {
    name: "Jacob Ramsey",
    email: "jacobramsey@gmail.com",
  };
  res.status(200).json(demoUser);
});

/**
 * @openapi
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
