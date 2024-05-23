// Import necessary modules
const businessPostModel = require("../models/businessPostModel");
const subCategoryModel = require("../models/subCategoryModel");
const { AuthUser,uploadImageToCloudinary } = require("../utils/helper");

// Define subcategoryController methods
const subCategoryController = {
    // Method to create a new subcategory
    create: async (req, res) => {
        let { category,name,image } = req.body;
        //upload image & cover image
        image = await uploadImageToCloudinary(image);
        try {
            const subCategoryInfo = await subCategoryModel.create({ category,name,image });
            res.status(201).send({
                success: true,
                message: "Sub Category Created Successfully",
                subCategoryInfo
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
        var subCategoryInfo;
        var { category,name,image,id} = req.body;
        //upload image & cover image
        if(image){
            image = await uploadImageToCloudinary(image);
             subCategoryInfo = await subCategoryModel.findOneAndUpdate({_id:id},{image});
        }
        try {
             subCategoryInfo = await subCategoryModel.findOneAndUpdate({_id:id},{category,name});
            res.status(201).send({
                success: true,
                message: "Sub Category updated Successfully",
                subCategoryInfo
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

    // Method to list all subcategories
    list: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let category  = searchParams.get('category');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;

        let query = {};

        if(category!=null)
        {
            query={category:category};
            console.log(category);
        }

        const count = await subCategoryModel.countDocuments(query);
            
        const totalPages = Math.ceil(count / limit);

        try {
            let subCategories = await subCategoryModel.find(query).populate({
                path: "category",
                model: "Category"
            }).sort({ createdAt: -1 }).skip(skip).limit(limit);
            
            // Iterate through each subcategory
            for (let subCategory of subCategories) {
                // Count the number of business posts for the current subcategory
                let businessPostCount = await businessPostModel.countDocuments({ sub_category: subCategory._id });
                
                console.log(`Subcategory: ${subCategory.name}, Business Post Count: ${businessPostCount}`);
                // Attach the businessPostCount to the current subcategory object
                subCategory.business_post_count = businessPostCount;
            }

            res.status(200).send({
                success: true,
                message: "SubCategories Retrieved Successfully",
                totalPages,
                currentPage: page,
                subCategories
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

// Export subcategoryController
module.exports = subCategoryController;
