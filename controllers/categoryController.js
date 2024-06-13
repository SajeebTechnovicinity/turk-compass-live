// Import necessary modules
const categoryModel = require("../models/categoryModel");
const { AuthUser,uploadImageToCloudinary } = require("../utils/helper");

// Define categoryController methods
const categoryController = {
    // Method to create a new category
    create: async (req, res) => {
        let { name,image } = req.body;
        //upload image & cover image
        image = await uploadImageToCloudinary(image);
        try {
            const categoryInfo = await categoryModel.create({ name,image });
            res.status(201).send({
                success: true,
                message: "Category Created Successfully",
                categoryInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating category',
                error: error.message
            });
        }
    },
    edit: async (req, res) => {
        let { name,image,id} = req.body;
        //upload image & cover image
        var updateObj={};

        if(image){
            image = await uploadImageToCloudinary(image);
            updateObj={...updateObj,image}
        }
        if(name){
            updateObj={...updateObj,name}
        }
  
        try {
            const categoryInfo = await categoryModel.findOneAndUpdate({_id:id},updateObj);
            res.status(201).send({
                success: true,
                message: "Category Updated Successfully",
                categoryInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating category',
                error: error.message
            });
        }
    },

    // Method to list all categories
    list: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
            let type = searchParams.get('type');

            let query = {};

            if (type === "business") {
                query.name = { $nin: ["Member of Perlamant", "Promotion Calender"] };
            }
            
            const categories = await categoryModel.find(query);
            res.status(200).send({
                success: true,
                message: "Categories Retrieved Successfully",
                categories
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

// Export categoryController
module.exports = categoryController;
