const cloudinary = require("cloudinary");
require("dotenv").config();

const cloudName = process.env.CLOUDINARY_NAME;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const apiKey = process.env.CLOUDINARY_API_KEY;

cloudinary.v2.config({
  api_key: apiKey,
  api_secret: apiSecret,
  cloud_name: cloudName,
});
