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
  if (!fileExtendCheck && file.originalname !== "blob") {
    callback(
      new ApiError(httpStatus.NOT_ACCEPTABLE, "file is not acceptable"),
      false
    );
  } else {
    callback(null, true);
  }
};

const singleUpload = multer({
  storage,
  fileFilter,
}).single("upload");
