const { Router } = require("express");
const router = Router();

const {
  authenticateUser,
  restrictBlockedUsers,
} = require("../middlewares/header");

const {
  createPost,
  addComments,
  deletePost,
  editPost,
  getAllPosts,
  getSinglePost,
  likePost,
} = require("../controllers/posts.controllers");

router.post("/", authenticateUser, restrictBlockedUsers, createPost);
router.post(
  "/comment/:id",
  authenticateUser,
  restrictBlockedUsers,
  addComments
);
router.put("/like", authenticateUser, restrictBlockedUsers, likePost);
router.get("/", authenticateUser, restrictBlockedUsers, getAllPosts);
router.get("/:id", authenticateUser, restrictBlockedUsers, getSinglePost);
router.put("/:id", authenticateUser, editPost);
router.delete("/:id", authenticateUser, deletePost);

module.exports = router;
