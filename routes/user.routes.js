const express = require("express");
const validate = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");
const validateAccount = require("../middlewares/validateUser");
const { singleUpload } = require("../libs/multer");

const router = express.Router();

/**
 * @swagger
 * securityDefinitions:
 *    BearerAuth:
 *      type: apiKey
 *      name: Authorization
 *      in: header
 * /konnect/users/:
 *  get:
 *    tags:
 *      - User Profile
 *    summary: Get all users
 *    description: Retrieve a list of all registered users.
 *    security:
 *    - BearerAuth: []
 *    parameters:
 *      - name: search
 *        in: query
 *        description: Search term to filter users.
 *        required: false
 *        type: string
 *      - name: role
 *        in: query
 *        description: Filter users by role.
 *        required: false
 *        type: string
 *      - name: token
 *        in: query
 *    responses:
 *        '200':
 *          description: A list of users
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                name:
 *                  type: string
 *                role:
 *                  type: string
 *        '400':
 *            description: Bad request
 *        '500':
 *            description: Internal server error
 *
 */
router
  .route("/")
  .get(validateAccount, userController.getUsers)
  .put(
    validateAccount,
    validate(userValidation.updateProfile),
    userController.updateProfile
  );

/**
 * @swagger
 * /konnect/users/{userId}:
 *  get:
 *    tags:
 *      - User Profile
 *    summary: Get user by ID
 *    description: Get a registered user by his/her ID
 *    parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        type: integer
 *    responses:
 *        '200':
 *           description: Successful Operation
 *        '404':
 *           description: User not found
 *        '500':
 *           description: Internal server error
 */
router.get("/:userId", userController.getUser);

/**
 * @swagger
 * /konnect/users/compare-password:
 *  post:
 *    tags:
 *    - User Profile
 *    summary: Compare user's old and new password
 *    description:
 */
router.post(
  "/compare-password",
  validateAccount,
  userController.comparePassword
);
router.get("/by-username/:username", userController.getUserByUsername);
router.patch(
  "/upload/avatar",
  validateAccount,
  singleUpload,
  userController.updateAvatar
);
router.post("/follow/:userId", validateAccount, userController.followUser);
router.patch("/unfollow/:userId", validateAccount, userController.unfollowUser);

module.exports = router;
