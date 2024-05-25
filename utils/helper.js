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

function isBase64Image(str) {
    if (typeof str !== 'string') {
        return false;
    }
    // Check if the string starts with 'data:image/png;base64,'
    const base64ImagePattern = /^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/]+={0,2}$/;
    // Split the string into header and the base64 part
    const parts = str.split(',');
    if (parts.length !== 2) {
        return false;
    }
    // Validate the header
    const header = parts[0];
    const base64Part = parts[1];
    
    if (!/^data:image\/(png|jpeg|jpg|gif);base64$/.test(header)) {
        return false;
    }

    // Validate the Base64 part
    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Pattern.test(base64Part)) {
        return false;
    }
    return true;
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

//send push notification
async function sendPushNotification(title,body,tokenList) {
    try {
        const url = 'https://fcm.googleapis.com/fcm/send';
        const FcmToken = 'cDGuFYhXRwGcKVNL0eEfGk:APA91bFZwfPDpns1-oJPgARsXwYcx6yHVW6SLE3dLlw1ijKXyHsy-NJ_-g-jqMzeY_9FnoCjOruZPdPUKqi9bO08brZfa7aLXjcY1IaeAPEpr2QWkBuxHytpKBRCm53KICo6TmgyBcpU';
        const serverKey = 'AAAAdDphlNY:APA91bHfBhSFbxrH5BJXRQHErIVHRfrCC8hQvXAOtST8JuJkC8inBmodKWSIWfUp42FcWym9M-E9Gp06HoFwfpTfn6sW4sl3P8g8fB8uKMc0CZBalE-czydQJyoOQL0q9W0FjlHBYC10'; // ADD SERVER KEY HERE PROVIDED BY FCM
        
        const data = {
            registration_ids: FcmToken,
            notification: {
                title: title,
                body: body,
            },
        };
        
        const headers = {
            Authorization: 'key=' + serverKey,
            'Content-Type': 'application/json',
        };
        
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                console.log(response);
            } else {
                console.error(response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    catch(error)
    {
        console.error('Error:', error);
    }
}


module.exports = { AuthUser, uploadImageToCloudinary,isBase64Image, sendPushNotification};
