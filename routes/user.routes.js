const express = require("express");
const validate = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");
const validateAccount = require("../middlewares/validateUser");
const { singleUpload } = require("../libs/multer");

const router = express.Router();

router
  .route("/")
  .get(validateAccount, userController.getUsers)
  .put(
    validateAccount,
    validate(userValidation.updateProfile),
    userController.updateProfile
  );

router.get("/:userId", userController.getUser);
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
router.get(
  "/followers/:userId",
  validateAccount,
  userController.getUserFollowers
);
router.get(
  "/followings/:userId",
  validateAccount,
  userController.getUserFollowing
);
router.get(
  "/following/:userId",
  validateAccount,
  userController.isUserFollowing
);

router.get("/me/books/", validateAccount, userController.getUserPosts);
router.get("/books/:id", userController.getPostsByUserId);

router.patch(
  "/toggle-mature-content",
  validateAccount,
  userController.toggleMatureContents
);
router.patch(
  "/allow-direct-messaging",
  validateAccount,
  userController.toggleDirectMessaging
);
