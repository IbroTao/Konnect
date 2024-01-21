const { Router } = require("express");
const router = Router();

const {
  authenticateUser,
  restrictBlockedUsers,
} = require("../middlewares/header");

const { getUserChats, sendChats } = require("../controllers/chat.controller");

router.post("/", authenticateUser, restrictBlockedUsers, sendChats);
router.get("/", authenticateUser, restrictBlockedUsers, getUserChats);

module.exports = router;
