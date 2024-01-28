const cloud = require('cloudinary');
const path = require('path');
const {cloudinary} = require('../configs/config');

require('dotenv').config({path: path.resolve(process.cwd), '.env'});

cloud.v2.config(cloudinary);