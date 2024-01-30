const express = require("express");
const passport = require("passport");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const validateAccount = require("../middlewares/validateUser");

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

module.exports = router;
