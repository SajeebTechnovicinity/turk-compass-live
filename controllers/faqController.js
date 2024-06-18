// Import necessary modules
const faqModel = require("../models/faqModel");
const { AuthUser,uploadImageToCloudinary } = require("../utils/helper");

// Define faqController methods
const faqController = {
    // Method to create a new faq
    create: async (req, res) => {
        let { title,description } = req.body;

        try {
            const faqInfo = await faqModel.create({ title,description });
            res.status(201).send({
                success: true,
                message: "Faq Created Successfully",
                faqInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating faq',
                error: error.message
            });
        }
    },
    edit: async (req, res) => {
        let { title,description,id} = req.body;
        //upload image & cover image
        var updateObj={};

        if(title){
            updateObj={...updateObj,title}
        }
        if(description){
            updateObj={...updateObj,description}
        }
  
        try {
            const faqInfo = await faqModel.findOneAndUpdate({_id:id},updateObj);
            res.status(201).send({
                success: true,
                message: "Faq Updated Successfully",
                faqInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating faq',
                error: error.message
            });
        }
    },

    // Method to list all categories
    list: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
            
            const faqs = await faqModel.find().sort({createdAt:-1});
            res.status(200).send({
                success: true,
                message: "Faqs Retrieved Successfully",
                faqs
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

    delete: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let id = searchParams.get('id');

        try {
            const faqInfo = await faqModel.findByIdAndDelete(id);
            res.status(200).send({
                success: true,
                message: "Faq Deleted Successfully",
                faqInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in deleting faq',
                error: error.message
            });
        }
    }
};

// Export faqController
module.exports = faqController;
