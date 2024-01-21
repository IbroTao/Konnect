const { Router } = require("express");
const router = Router();

const {
  authenticateAdmin,
  authenticateUser,
  restrictBlockedUsers,
} = require("../middlewares/header");

const {
  blockUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  sendResetPasswordTokenViaEmail,
  unblockUser,
  updatePassword,
  updatePasswordViaEmail,
  updateUserDetails,
} = require("../controllers/user.controllers");

router.post("/reset-password/:token", authenticateUser, updatePasswordViaEmail);
router.post(
  "/forgot-password-token",
  authenticateUser,
  sendResetPasswordTokenViaEmail
);

router.get("/", authenticateUser, authenticateAdmin, getAllUsers);
router.get("/:id", authenticateUser, restrictBlockedUsers, getSingleUser);

router.put("/block/:id", authenticateAdmin, blockUser);
router.put("/unblock/:id", authenticateAdmin, unblockUser);
router.put("/password", authenticateUser, updatePassword);
router.put("/:id", authenticateUser, updateUserDetails);

router.delete("/:id", authenticateUser, deleteUser);

module.exports = router;
