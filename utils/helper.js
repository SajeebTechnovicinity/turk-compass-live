const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinaryV2 = require('cloudinary').v2;

// Configure Cloudinary
cloudinaryV2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Assuming this function is within an Express route handler
async function AuthUser(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return false;
    }

    const [bearer, token] = authHeader.split(' ');

    // Check if the Authorization header is in the Bearer format
    if (bearer !== 'Bearer' || !token) {
        // Handle case where Authorization header is not in the Bearer format
        return false;
    }

    // At this point, 'token' contains the bearer token

    try {
        let info = await jwt.decode(token);
        return info;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        throw new Error('Error decoding JWT');
    }
}


// Image Upload to Cloudinary
async function uploadImageToCloudinary(base64String) {
    try {
        const result = await cloudinaryV2.uploader.upload(base64String, {
          folder: 'turk-compass' // Optionally, specify a folder in Cloudinary
        });
        return result.url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Error uploading image to Cloudinary');
    }
}

module.exports = { AuthUser, uploadImageToCloudinary };
