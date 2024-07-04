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
        
            let totalUser = await userModel.countDocuments({is_delete: false,status: 1,is_email_verified:1});
            let inactiveUser = await userModel.countDocuments()-totalUser-1;
            // let inactiveUser = await userModel.countDocuments({
            //     $or: [
            //       { is_delete: 1 },
            //       { status: 0 }
            //     ]
            //   });
            let totalCanceledReservations = await reservationModel.countDocuments({is_canceled: 1});
            let totalConfirmedReservations = await reservationModel.countDocuments({is_canceled: 0});
            let totalJob = await jobModel.countDocuments({is_delete: 0});
            let freeUser = await userModel.countDocuments({package_type:'free',is_delete: false,status: 1,is_email_verified:1});
            let premiumUser = await userModel.countDocuments({package_type:'premium',is_delete: false,status: 1,is_email_verified:1});
            let jobSeekerUser = await userModel.countDocuments({package_type:'job_seeker',is_delete: false,status: 1,is_email_verified:1});
            let premium_employer= await userModel.countDocuments({package_type:'premium_employer',is_delete: false,status: 1,is_email_verified:1});
            let general_employer= await userModel.countDocuments({package_type:'general_employer',is_delete: false,status: 1,is_email_verified:1});
            let totalActiveBusinessPost = await businessPostModel.countDocuments({is_delete: 0});
            let totalInactiveBusinessPost = await businessPostModel.countDocuments({is_delete: 1});
            let totalCategory= await categoryModel.countDocuments({is_delete:0})-2;
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
