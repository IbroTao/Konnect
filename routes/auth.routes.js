const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const modelNames = require("../constants/modelNames");

const router = express.Router();

// /**
//  * @swagger
//  * /konnect/auth/profile:
//  *  get:
//  *    summary: Fetch user details
//  *    description: Fetch user details
//  *    tags:
//  *      - Profile
//  *    responses:
//  *      '200':
//  *        description: User profile fetched successfully
//  *      '400':
//  *         description: Unable to fetch user details
//  */
router.get("/profile", (req, res) => {
  const demoUser = {
    name: "Jacob Ramsey",
    email: "jacobramsey@gmail.com",
  };
  res.status(200).json(demoUser);
});

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

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
