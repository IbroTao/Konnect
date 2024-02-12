const express = require("express");
const validate = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");
const validateAccount = require("../middlewares/validateUser");
const { singleUpload } = require("../libs/multer");

const router = express.Router();

router
  .route("/")
  .get(validateAccount, userController.getUsers)
  .put(
    validateAccount,
    validate(userValidation.updateProfile),
    userController.updateProfile
  );

router.get("/:userId", userController.getUser);
