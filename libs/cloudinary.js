const cloud = require('cloudinary');
const path = require('path');
const {cloudinary} = require('../configs/config');

require('dotenv').config({path: path.resolve(process.cwd), '.env'});

cloud.v2.config(cloudinary);

const uploadSingle = async(filePath) => {
    const {secure_url, public_id} = await cloud.v2.uploader.upload(filePath);
    return {url: secure_url, publicId: public_id}
};

const deleteSingle = async(fileUrl) => {
    return await cloud.v2.uploader.destroy(fileUrl);
}

module.exports = {
    uploadSingle,
    deleteSingle
}