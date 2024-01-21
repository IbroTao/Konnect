const { Router } = require("express");
const router = Router();

const multer = require("multer");

const {
  authenticateUser,
  restrictBlockedUsers,
} = require("../middlewares/header");

const { fileFilter, fileStorage } = require("../utils/multer");

const {
  createPost,
  addComments,
  deletePost,
  editPost,
  getAllPosts,
  getSinglePost,
  likePost,
} = require("../controllers/posts.controllers");

router.post(
  "/",
  authenticateUser,
  restrictBlockedUsers,
  multer({ fileFilter, fileStorage }).single("image"),
  createPost
);

router.post(
  "/comment/:id",
  authenticateUser,
  restrictBlockedUsers,
  addComments
);
router.put("/like", authenticateUser, restrictBlockedUsers, likePost);
router.put(
  "/:id",
  authenticateUser,
  restrictBlockedUsers,
  multer({ fileFilter, fileStorage }),
  editPost
);

router.get("/", authenticateUser, restrictBlockedUsers, getAllPosts);
router.get("/:id", authenticateUser, restrictBlockedUsers, getSinglePost);

router.delete("/:id", authenticateUser, deletePost);

module.exports = router;
