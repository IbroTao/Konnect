const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const modelNames = require("../constants/modelNames");

const router = express.Router();

/**
 * @swagger
 * /konnect/auth/profile:
 *  get:
 *    summary: Fetch user details
 *    description: Fetch user details
 *    tags:
 *      - Profile
 *    responses:
 *      '200':
 *        description: User profile fetched successfully
 *      '400':
 *         description: Unable to fetch user details
 */
router.get("/profile", (req, res) => {
  const demoUser = {
    name: "Jacob Ramsey",
    email: "jacobramsey@gmail.com",
  };
  res.status(200).json(demoUser);
});

/**
 * @swagger
 * /konnect/auth/register:
 *  post:
 *    summary: Registration of new user
 *    description: Register a new user for the first time
 *    tags:
 *      - User Authentication
 *    responses:
 *       '201':
 *          description: User registered successfully
 *       '400':
 *          description: Failed to register a user
 */
router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

/**
 * @swagger
 * /konnect/auth/login:
 *  post:
 *     summary: Logging a registered user
 *     description: After a user has registered, the user can now login
 *     tags:
 *     - User Authentication
 *     responses:
 *         '200':
 *           description: User logged in successfully
 *         '400':
 *            description: User unable to log in
 */
router.post("/login", validate(authValidation.login), authController.login);

/**
 * @swagger
 * /konnect/auth/verify-email:
 *  post:
 *    summary: Send verification email to a user during registration
 *    description: A 6-digits code would be sent to the user for verification
 *    tags:
 *    - User Authentication
 *    responses:
 *        '200':
 *           description: Verification email sent to the user
 *        '400':
 *           description: Unable to send verification email
 */
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
