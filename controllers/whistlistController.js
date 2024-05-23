// Import necessary modules
const whistlistModel = require("../models/whistlistModel");
const { AuthUser } = require("../utils/helper");

// Define whistlistController methods
const whistlistController = {
    // Method to create a new whistlist
    create: async (req, res) => {
        const { business_post } = req.body;
        try {
            const user_info= await AuthUser(req);
            const user=user_info.id;
            const whistlistCount = await whistlistModel.countDocuments({ user:user,business_post:business_post });
            if(whistlistCount>0)
            {
                return res.status(200).send({
                    success: false,
                    message: "Already whistlist this business profile",
                    error: "Already whistlist this business profile",
                });
            }
            const whistlistInfo = await whistlistModel.create({ user:user,business_post:business_post });
           
            res.status(201).send({
                success: true,
                message: "whistlist Created Successfully",
                whistlistInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating whistlist',
                error: error.message
            });
        }
    },

    // Method to list all countries
    list: async (req, res) => {
        try {
            const user_info= await AuthUser(req);
            const user=user_info.id;
            const whishlists = await whistlistModel.find({user:user}).populate({
                path:"business_post",
                model:"BusinessPost"
            }).sort({createdAt:-1});
            res.status(200).send({
                success: true,
                message: "Whistlist Retrieved Successfully",
                whishlists
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching countries',
                error: error.message
            });
        }
    },

    delete: async (req, res) => {
        const { business_post } = req.body;
        try {
            const user_info= await AuthUser(req);
            const user=user_info.id;
            const whishlist = await whistlistModel.deleteOne({user:user,business_post:business_post});
            res.status(200).send({
                success: true,
                message: "Whistlist Deleted Successfully",
                whishlist
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching countries',
                error: error.message
            });
        }
    }
};

// Export whistlistController
module.exports = whistlistController;
