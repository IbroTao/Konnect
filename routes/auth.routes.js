const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const { authenticateUser } = require("../middlewares/authenticateUser");

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
 *          description: User profile fetched successfully
 *      '400':
 *          description: Unable to fetch user details
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
 *    tags:
 *      - User Authentication
 *    summary: Create a new user
 *    description: Create a new user with the provided details
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *          examples:
 *            example:
 *              value:
 *                username: paul_smith1
 *                name: Paul Smith
 *                email: paulsmith@gmail.com
 *                password: password123
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *          examples:
 *            example:
 *              value:
 *                name: Paul Smith
 *                username: paul_smith1
 *                email: paulsmith@gmail.com
 *                password: paul123
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *          examples:
 *            example:
 *              value:
 *                name: Paul Smith
 *                username: paul_smith1
 *                email: paulsmith@gmail.com
 *                password: paul123
 *    responses:
 *      '201':
 *        description: User registered successfully
 *      '400':
 *        description: Bad Request - Invalid Request
 *      '500':
 *        description: Internal server error
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
 *     tags:
 *     - User Authentication
 *     summary: Login a registered user
 *     description: After a user has registered, login the user
 *     requestBody:
 *       content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   email:
 *                      type: string
 *                   password:
 *                      type: string
 *                examples:
 *                    email: paulsmith@gmail.com
 *                    password: paul123
 *          application/x-www-form-urlencoded:
 *              schema:
 *                 type: object
 *                 properties:
 *                    email:
 *                       type: string
 *                    password:
 *                       type: string
 *                examples:
 *                    email: paulsmith@gmail.com
 *                    password: paul123
 *          multipart/form-data:
 *              schema:
 *                 type: object
 *                 properties:
 *                     email:
 *                        type: string
 *                     password:
 *                        type: string
 *                 examples:
 *                     email: paulsmith@gmail.com
 *                     password: paul123
 *     responses:
 *         '200':
 *           description: User logged in successfully
 *         '400':
 *            description: Bad Request - Invalid Request
 *         '500':
 *            description: Internal server error
 */
router.post("/login", validate(authValidation.login), authController.login);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 */

/**
 * @swagger
 * /konnect/auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: Send a verification email to the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 $ref: '#/components/schemas/User'
 *     responses:
 *       '204':
 *         description: Email sent successfully
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error
 */
router.post(
  "/send-verification-email",
  validate(authValidation),
  authController.sendVerificationEmail
);

/**
 * @swagger
 * /konnect/auth/verify-otp:
 *  post:
 *    tags:
 *    - User Authentication
 *    summary: Verify the OTP code sent to the user for verification
 *    description: Confirmation of the authenticity of the email the user used for registration
 *    requestBody:
 *        content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    digits:
 *                        type: string
 *                examples:
 *                    digits: "239012"
 *           application/x-www-urlencoded:
 *              schema:
 *                type: object
 *                properties:
 *                    digits:
 *                        type: string
 *                examples:
 *                    digits: "239012"
 *           multipart/form-data:
 *              schema:
 *                type: object
 *                properties:
 *                    digits:
 *                        type: string
 *                examples:
 *                    digits: "239012"
 *    responses:
 *      '200':
 *         description: Account has been verified
 *      '400':
 *         description: Bad Request - Invalid Request
 *      '500':
 *         description: Internal Server Error
 */
router.post(
  "/verify-otp",
  validate(authValidation.validateAcct),
  authController.verifyAccount
);

/**
 * @swagger
 * /konnect/auth/refresh-tokens:
 *  post:
 *    tags:
 *    - User Authentication
 *    summary: Generate new tokens(access & refresh)
 *    description: After old tokens has expired. New tokens would be generated
 *    requestBody:
 *         content:
 *            application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     refreshToken:
 *                        type: string
 *                  examples:
 *                      refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiI2NWU2MDk0ODQyOWYxYmJkNzQ5OTNlY2YiLCJleHAiOjE3MDk2NjAxOTYsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDk2NjAxOTZ9.yEKTUi3AdUg3coULLg7nHlpZBvL7i-udH89DcRJGukE
 *            application/x-www-url-encoded:
 *                schema:
 *                  type: object
 *                  properties:
 *                     refreshToken:
 *                        type: string
 *                  examples:
 *                      refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiI2NWU2MDk0ODQyOWYxYmJkNzQ5OTNlY2YiLCJleHAiOjE3MDk2NjAxOTYsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDk2NjAxOTZ9.yEKTUi3AdUg3coULLg7nHlpZBvL7i-udH89DcRJGukE
 *            multipart/form-data:
 *                schema:
 *                  type: object
 *                  properties:
 *                     refreshToken:
 *                        type: string
 *                  examples:
 *                      refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiI2NWU2MDk0ODQyOWYxYmJkNzQ5OTNlY2YiLCJleHAiOjE3MDk2NjAxOTYsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDk2NjAxOTZ9.yEKTUi3AdUg3coULLg7nHlpZBvL7i-udH89DcRJGukE
 *    responses:
 *      '200':
 *         description: Tokens has been generated
 *      '400':
 *         description: Tokens failed to be generated
 */
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

/**
 * @swagger
 * /konnect/auth/resend-verification-code:
 *  post:
 *    tags:
 *    - User Authentication
 *    summary: Resend verification code for user authentication
 *    description: Get another verification before logging in
 *    requestBody:
 *         content:
 *            application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                        type: string
 *                  examples:
 *                      email: paulsimth123@gmail.com
 *    responses:
 *      '200':
 *         description: Verification code sent
 *      '500':
 *         description: Failed to send, try again later
 */
router.post(
  "/resend-verification-code",
  validate(authValidation.email),
  authController.resendVerificationCode
);

module.exports = router;
