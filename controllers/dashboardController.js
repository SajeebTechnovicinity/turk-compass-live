// Import necessary modules
const businessPostModel = require("../models/businessPostModel");
const categoryModel = require("../models/categoryModel");
const jobIndustryModel = require("../models/jobIndustryModel");
const jobModel = require("../models/jobModel");
const memberPerlamantModel = require("../models/memberPerlamantModel");
const reservationModel = require("../models/reservationModel");
const subCategoryModel = require("../models/subCategoryModel");
const userModel = require("../models/userModel");
const { AuthUser } = require("../utils/helper");

// Define countryController methods
const dashboardController = {
   
    // Method to dashboard
    show: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        try {
            let activeUser = await userModel.countDocuments({is_delete: 0});
            let inactiveUser = await userModel.countDocuments({is_delete: 1});
            let totalUser = await userModel.countDocuments();
            let totalCanceledReservations = await reservationModel.countDocuments({is_canceled: 1});
            let totalConfirmedReservations = await reservationModel.countDocuments({is_canceled: 0});
            let totalJob = await jobModel.countDocuments({is_delete: 0});
            let freeUser = await userModel.countDocuments({package_type:'free'});
            let premiumUser = await userModel.countDocuments({package_type:'premium'});
            let jobSeekerUser = await userModel.countDocuments({user_type:'job_seeker'});
            let premium_employer= await userModel.countDocuments({user_type:'premium_employer'});
            let general_employer= await userModel.countDocuments({user_type:'general_employer'});
            let totalActiveBusinessPost = await businessPostModel.countDocuments({is_delete: 0});
            let totalInactiveBusinessPost = await businessPostModel.countDocuments({is_delete: 1});
            let totalCategory= await categoryModel.countDocuments({is_delete:0});
            let totalSubCategory= await subCategoryModel.countDocuments({is_delete:0});
            let totalMemerOfPerlamant = await memberPerlamantModel.countDocuments({is_delete:0});
            let totalIndustry = await jobIndustryModel.countDocuments({is_delete:0});

            res.status(200).send({
                success: true,
                message: "Dashboard Data Retrieved Successfully",
                activeUser,
                inactiveUser,
                totalUser,
                totalCanceledReservations,
                totalConfirmedReservations,
                totalJob,
                freeUser,
                premiumUser,
                jobSeekerUser,
                premium_employer,
                general_employer,
                totalActiveBusinessPost,
                totalInactiveBusinessPost,
                totalCategory,
                totalSubCategory,
                totalMemerOfPerlamant,
                totalIndustry
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching citys',
                error: error.message
            });
        }
    }
};

// Export dashboardController
module.exports = dashboardController;
