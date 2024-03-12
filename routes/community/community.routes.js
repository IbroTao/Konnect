const express = require("express");
const validate = require("../../middlewares/validate");
const { communityValidation } = require("../../validations");
const { singleUpload, multipleUpload } = require("../../libs/multer");
const validateAccount = require("../../middlewares/validateUser");
const {} = require("../../controllers");

const router = express.Router();

router.post(
  "/new",
  validateAccount,
  validate(communityValidation),
  communityController
);
