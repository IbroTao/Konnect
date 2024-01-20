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
} = require("../controllers/groups.contollers");

module.exports = router;
