const express = require("express");
const validate = require("../../middlewares/validate");
const {} = require("../../validations");
const { singleUpload, multipleUpload } = require("../../libs/multer");
const validateAccount = require("../../middlewares/validateUser");

const router = express.Router();

router.post("/new", validateAccount, validate(communityValidation));
