// Import necessary modules
const contactModel = require("../models/contactModel");
const { AuthUser,uploadImageToCloudinary } = require("../utils/helper");

// Define contactController methods
const contactController = {
    // Method to create a new contact
    create: async (req, res) => {
        let { name,email,subject,message } = req.body;
        try {
            const contactInfo = await contactModel.create({ name,email,subject,message });
            res.status(201).send({
                success: true,
                message: "Contact Created Successfully",
                contactInfo
            });
        } catch (error) {
            console.log(error);
            res.status(403).send({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    },

    // Method to list all categories
    list: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
    
            const contacts = await contactModel.find();
            res.status(200).send({
                success: true,
                message: "Contact Retrieved Successfully",
                contacts
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

// Export contactController
module.exports = contactController;
