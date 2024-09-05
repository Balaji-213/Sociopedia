import dotenv from 'dotenv';
dotenv.config(); 

// var cloudinary = require('cloudinary').v2;
// backend/cloudinaryConfig.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'YOUR_CLOUD_NAME',
    api_key: 'YOUR_API_KEY',
    api_secret: 'YOUR_API_SECRET'
});

export default cloudinary;


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_ID, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

export const uploadImage = (image) => { // image is converted to base64
    return new Promise((resolve, reject) => {
        cloudinary.uploader.unsigned_upload(image, 'newupload', { folder: 'media' }, (error, result) => {
            if (result && result.secure_url) {
                return resolve(result.secure_url);
            }
            return reject({ message: error.message });
        });
    });
};



// export default uploadImage;