// Import necessary modules
const tagModel = require("../models/tagModel");
const { AuthUser,uploadImageToCloudinary } = require("../utils/helper");

// Define tagController methods
const tagController = {
    // Method to create a new tag
    create: async (req, res) => {
        let {name,category} = req.body;
        try {
            const tagInfo = await tagModel.create({name,category});
            res.status(201).send({
                success: true,
                message: "Tag Created Successfully",
                tagInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating tag',
                error: error.message
            });
        }
    },
    edit: async (req, res) => {
        let { name,id,category} = req.body;
        //upload image & cover image
        var updateObj={name:name,category:category};
  
        try {
            const tagInfo = await tagModel.findOneAndUpdate({_id:id},updateObj);
            res.status(201).send({
                success: true,
                message: "Tag Updated Successfully",
                tagInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating tag',
                error: error.message
            });
        }
    },

    // Method to list all categories
    list: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
    
            const tags = await tagModel.find().populate({
                path: "category",
                model: "Category"
            });
            res.status(200).send({
                success: true,
                message: "Tags Retrieved Successfully",
                tags
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching tags',
                error: error.message
            });
        }
    }
};

// Export tagController
module.exports = tagController;
