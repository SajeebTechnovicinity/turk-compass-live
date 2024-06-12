// Import necessary modules
const notificationModel = require("../models/notificationModel");
const { AuthUser,uploadImageToCloudinary } = require("../utils/helper");

// Define notificationController methods
const notificationController = {
  
    // Method to list all notifications
    list: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
            let page = Number(searchParams.get('page')) || 1;
            let limit = Number(searchParams.get('limit')) || 12;
            let skip = (page - 1) * limit;

            const user_info= await AuthUser(req);
            const user_id=user_info.id;

            const count = await notificationModel.countDocuments({user:user_id});
            
            const totalPages = Math.ceil(count / limit);

            const notifications = await notificationModel.find({user:user_id}).sort({createdAt:-1}).skip(skip)
            .limit(limit);

            const notificationUpdate =  await notificationModel.updateMany({user:user_id},{is_seen:1});
            res.status(200).send({
                success: true,
                message: "Notifications Retrieved Successfully",
                notifications,
                totalPages,
                totalCount:count,
                currentPage: page,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching categories',
                error: error.message
            });
        }
    },

    // Method to list all notifications
    unseenCount: async (req, res) => {
        try {
            const user_info= await AuthUser(req);
            const user_id=user_info.id;

            const unseenNotificationAmount = await notificationModel.countDocuments({user:user_id,is_seen:0});
      
            res.status(200).send({
                success: true,
                message: "Unseen Notifications Count Retrieve Successfully",
                unseenNotificationAmount
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching notifications',
                error: error.message
            });
        }
    }
};

// Export notificationController
module.exports = notificationController;
