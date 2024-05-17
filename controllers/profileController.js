// Import necessary modules
const userModel = require("../models/userModel");
const bcrypt= require('bcrypt');
const { uploadImageToCloudinary } = require("../utils/helper");
const { AuthUser } = require("../utils/helper");

// Define profile Controller methods
const profileController = {

    list: async (req, res) => {
        try {
            const user_info= await AuthUser(req);
            user_id=user_info.id;

            const profile = await userModel.findById(user_id);
    
            res.status(200).send({
                success: true,
                message: "User Profile Retrieved Successfully",
                profile
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching categories',
                error: error.message
            });
        }
    }
    
};

// Export profileController
module.exports = profileController;
