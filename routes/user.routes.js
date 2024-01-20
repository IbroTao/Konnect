const { Router } = require("express");
const router = Router();

const {
  loginUser,
  logoutUser,
  signupUser,
  verifyAndSignupUser,
} = require("../controllers/auth.controller");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyAndSignupUser);
router.get("/logout", logoutUser);

module.exports = router;
