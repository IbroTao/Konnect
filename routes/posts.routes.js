const { Router } = require("express");
const router = Router();

const {
  authenticateAdmin,
  authenticateUser,
  restrictBlockedUsers,
} = require("../middlewares/header");

const {
  createPost,
  addComments,
  deletePost,
  dislikePost,
  editPost,
  getAllPosts,
  getSinglePost,
  likePost,
} = require("../controllers/posts.controllers");

router.post("/", authenticateUser, restrictBlockedUsers, createPost);
router.delete("/:id", authenticateUser, deletePost);
router.put("/:id", authenticateUser, editPost);

module.exports = router;
