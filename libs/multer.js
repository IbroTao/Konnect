const multer = require("multer");
const path = require("path");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { allowedFileExtensions } = require("../utils/fileTypes");

const storage = multer.diskStorage({});

const fileFilter = function (req, file, callback) {
  const fileExtendCheck = allowedFileExtensions.includes(
    path.extname(file.originalname).toLowerCase()
  );
  if
};
