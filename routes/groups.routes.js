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
  likePost,
  addMembers,
  getAllMembers,
  makeAdmin,
  getGroupMessages,
  sendMessage,
} = require("../controllers/groups.contollers");

router.post("/", authenticateUser, createGroup);
router.post("/message", authenticateUser, restrictBlockedUsers, sendMessage);
router.post("/posts", authenticateUser, restrictBlockedUsers, createPost);
router.post(
  "/:id/members/:id",
  authenticateAdmin,
  restrictBlockedUsers,
  addMembers
);
router.post(
  "/post/comment/:id",
  authenticateUser,
  restrictBlockedUsers,
  addComments
);
router.put("/:id", authenticateAdmin, restrictBlockedUsers, editGroupDetails);
router.put("/post/like", authenticateUser, restrictBlockedUsers, likePost);
router.put("/post/:id", authenticateUser, restrictBlockedUsers, editPost);
router.put(
  "/post/approve/:id",
  authenticateAdmin,
  restrictBlockedUsers,
  approvePost
);
router.get("/post/:id", authenticateUser, restrictBlockedUsers, getSinglePost);
router.get("/admin/:id", authenticateUser, restrictBlockedUsers, makeAdmin);
router.get("/:id/members", authenticateUser, getAllMembers);
router.get("/posts", authenticateAdmin, getAllPosts);
router.get("/message", authenticateUser, getGroupMessages);
router.delete("/:id", authenticateAdmin, deleteGroup);
router.delete("/post/:id", authenticateUser, deletePost);

module.exports = router;
