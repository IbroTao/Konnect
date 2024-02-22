const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const validateAccount = require("../../middlewares/validateUser");
const { groupValidation } = require("../../validations");
const { groupController } = require("../../controllers");
const { singleUpload, multipleUpload } = require("../../libs/multer");
const { isAdmin, adminPermitter } = require("../../middlewares/roles");

const router = express.Router();

router.get("/recent-msgs", validateAccount, groupController);
