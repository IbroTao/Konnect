const { Router } = require("express");
const router = Router();

const {
  authenticateAdmin,
  authenticateUser,
  restrictBlockedUsers,
} = require("../middlewares/header");

const {
  addComments,
  approvePost,
  createGroup,
  createPost,
  deleteGroup,
  deletePost,
  editGroupDetails,
  editPost,
  getAllPosts,
  getSinglePost,
  getUserGroups,
  joinGroup,
  likePost,
  makeAdmin,
  getGroupMembers,
  getGroupMessages,
  sendMessage,
} = require("../controllers/groups.contollers");

router.post("/", authenticateUser, createGroup);
router.post("/posts/", authenticateUser, createPost);
router.put("/:id", authenticateAdmin, editGroupDetails);
router.put("/post/:id", authenticateUser, editPost);
router.put("/post/approve/:id", authenticateAdmin, approvePost);
router.get("/post/:id", authenticateUser, getSinglePost);
router.get();
router.get("/posts/", authenticateAdmin, getAllPosts);
router.delete("/:id", authenticateAdmin, deleteGroup);
router.delete("/post/:id", authenticateUser, deletePost);

module.exports = router;
