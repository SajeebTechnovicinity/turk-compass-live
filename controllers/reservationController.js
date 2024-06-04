// Import necessary modules
const { token } = require("morgan");
const businessPostModel = require("../models/businessPostModel");
const notificationModel = require("../models/notificationModel");
const reservationModel = require("../models/reservationModel");
const slotModel = require("../models/slotModel");
const { AuthUser, sendPushNotification } = require("../utils/helper");
const { ObjectId } = require('mongodb');
const userModel = require("../models/userModel");

// Define reservationController methods
const reservationController = {
    // Method to create a new reservation
    create: async (req, res) => {
        const { business_post,slot,number_of_person,note } = req.body;
        const user_info= await AuthUser(req);
        const user_id=user_info.id;
        try {
            const slotDetails=await slotModel.findOne({_id:slot});
            const reservationInfo = await reservationModel.create({ user:user_id,business_post,slot,duration_slot:slotDetails.duration_slot,slot_date:slotDetails.date,number_of_person,note });

            // Find and update slot
            const updatedSlot = await slotModel.findOneAndUpdate(
                { _id: slot },
                { $inc: { amount_of_reservation: 1 } }, // Increment amount_of_reservation by 1
                { new: true } // Return the updated document
            );
            const businessPostInfo = await businessPostModel.findOne({ _id: business_post}).populate({
                path: 'user',
                model: 'User'
            });
            let title = "Reservation Created";
            let description = "Reservation Created against your business";
            let userInfo=await userModel.findOne({ _id: user_id});
            await notificationModel.create({user:businessPostInfo.user._id,title:title,description:description,image:userInfo.image});

            if(businessPostInfo.user.is_notification_on==1)
            {
                console.log(businessPostInfo.user.device_token);
                sendPushNotification(title,description,businessPostInfo.user.device_token);
            }

            res.status(201).send({
                success: true,
                message: "Reservation Created Successfully",
                reservationInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    },

    list: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let from_date = searchParams.get('from_date');
        let to_date = searchParams.get('to_date');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
    
        const user_info = await AuthUser(req);
        const user_id = user_info.id;
    
        try {
            const currentDate = new Date(from_date);
            const endDate = new Date(to_date);
            const reservationsByDate = [];
    
            while (currentDate <= endDate) {
                const date = currentDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    
                // Fetch slots for the current date
                const slots = await slotModel.find({ date });
    
                // Extract slot IDs from the slots found
                const slotIds = slots.map(slot => slot._id);
    
                // Find reservations associated with the slots found
                const reservations = await reservationModel.find({
                    user: user_id,
                    slot: { $in: slotIds } // Filter reservations based on slot IDs within the date range
                }).populate([
                    {
                        path: 'business_post',
                        model: 'BusinessPost'
                    },
                    {
                        path: 'slot',
                        model: 'Slot'
                    }
                ]);
    
                // Push the date along with reservations and count into reservationsByDate array
                reservationsByDate.push({
                    date,
                    reservations,
                    count: reservations.length // Count of reservations for this date
                });
    
                // Move to the next date
                currentDate.setDate(currentDate.getDate() + 1);
            }
    
            res.status(200).send({
                success: true,
                message: "Reservations Retrieved Successfully",
                reservationsByDate
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching reservations',
                error: error.message
            });
        }
    },
    allList: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
        try {
            const reservationsByDate = [];
    
            const reservations = await reservationModel.find().populate([
                {
                    path: 'business_post',
                    model: 'BusinessPost'
                },
                {
                    path: 'slot',
                    model: 'Slot'
                },
                {
                    path: 'user',
                    model: 'User'
                },
            ]).sort({createdAt:-1}) .skip(skip)
            .limit(limit);
    
            res.status(200).send({
                success: true,
                message: "Reservations Retrieved Successfully",
                reservations
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching reservations',
                error: error.message
            });
        }

    },

    businessOwnerList: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let from_date = searchParams.get('from_date');
        let to_date = searchParams.get('to_date');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
    
        const user_info = await AuthUser(req);
        const user_id = user_info.id;
    
        try {
            const currentDate = new Date(from_date);
            const endDate = new Date(to_date);
            const reservationsByDate = [];

            let businessPostCount=await businessPostModel.countDocuments({user:user_id});
            console.log(businessPostCount);
            if(businessPostCount==0)
            {
                return res.status(200).send({
                    success: false,
                    message: "No business post available",
                    error: "No business post available"
                });
            }

            let businessPostDetails=await businessPostModel.findOne({user:user_id});

            //console.log(businessPostDetails);
    
            while (currentDate <= endDate) {
                const date = currentDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    
                // Fetch slots for the current date
                const slots = await slotModel.find({ date,business_post:businessPostDetails._id });
    
                // Extract slot IDs from the slots found
                const slotIds = slots.map(slot => slot._id);
    
                // Find reservations associated with the slots found
                const reservations = await reservationModel.find({
                    business_post: businessPostDetails._id,
                    slot: { $in: slotIds } // Filter reservations based on slot IDs within the date range
                }).populate([
                    {
                        path: 'business_post',
                        model: 'BusinessPost'
                    },
                    {
                        path: 'slot',
                        model: 'Slot'
                    },
                    {
                        path: 'user',
                        model: 'User'
                    },
                ]);
    
                // Push the date along with reservations and count into reservationsByDate array
                reservationsByDate.push({
                    date,
                    reservations,
                    count: reservations.length // Count of reservations for this date
                });
    
                // Move to the next date
                currentDate.setDate(currentDate.getDate() + 1);
            }
    
            res.status(200).send({
                success: true,
                message: "Reservations Retrieved Successfully",
                reservationsByDate
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching reservations',
                error: error.message
            });
        }
    },

    cancelReservation: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let from_date = searchParams.get('from_date');
        let to_date = searchParams.get('to_date');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
    
        const user_info = await AuthUser(req);
        const user_id = user_info.id;
    
        try {
            const currentDate = new Date(from_date);
            const endDate = new Date(to_date);
            const reservationsByDate = [];
    
            let businessPostCount = await businessPostModel.countDocuments({ user: user_id });
            console.log(businessPostCount);
    
            if (businessPostCount == 0) {
                return res.status(200).send({
                    success: false,
                    message: "No business post available",
                    error: "No business post available"
                });
            }
    
            let businessPostDetails = await businessPostModel.findOne({ user: user_id });

            let userProfileUpdate = await userModel.findOneAndUpdate({_id:user_id},{from_date_vacation:from_date,to_date_vacation:to_date});
    
            // Iterate through each date in the date range
            while (currentDate <= endDate) {
                const date = currentDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    
                // Fetch slots for the current date
                const slots = await slotModel.find({ date, business_post: businessPostDetails._id });
    
                // Extract slot IDs from the slots found
                const slotIds = slots.map(slot => slot._id);
    
                // Find reservations associated with the slots found
                const reservations = await reservationModel.find({
                    business_post: businessPostDetails._id,
                    slot: { $in: slotIds },
                }).populate([
                    {
                        path: 'business_post',
                        model: 'BusinessPost'
                    },
                    {
                        path: 'slot',
                        model: 'Slot'
                    },
                    {
                        path: 'user',
                        model: 'User'
                    },
                ]);
    
                // Update reservations to set is_canceled to 1
                for (let reservation of reservations) {
                    reservation.is_canceled = 1;
                    await reservation.save();
                    let title = "Reservation Canceled";
                    let description = `Your reservation is canceled from authority. Please select a new slot without between ${from_date} to ${to_date}.`;
                    await notificationModel.create({user:reservation.user,title:title,description:description,image:businessPostDetails.image});

                    if(reservation.user.is_notification_on==1)
                    {
                        console.log(reservation.user.device_token);
                        sendPushNotification(title,description,reservation.user.device_token);
                    }
                    // Send notification to the user
                    //await sendNotification(reservation.user, `Your reservation on ${date} has been canceled.`);
                }
    
                // Move to the next date
                currentDate.setDate(currentDate.getDate() + 1);
            }
    
            res.status(200).send({
                success: true,
                message: "Reservations Canceled Successfully"
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching or canceling reservations',
                error: error.message
            });
        }
    },

    details: async (req, res) => {
      
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let id = searchParams.get('id');
    
        try {
            const reservationDetails= await reservationModel.findById(id).populate([
                {
                    path: 'business_post',
                    model: 'BusinessPost'
                },
                {
                    path: 'slot',
                    model: 'Slot'
                }
            ]);;
            res.status(200).send({
                success: true,
                message: "Reservations Retrieved Successfully",
                reservationDetails
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching reservations',
                error: error.message
            });
        }
    },

    cancelReservationIdWise: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let id = searchParams.get('id');
    
        const user_info = await AuthUser(req);
        const user_id = user_info.id;
    
        try {
            
            let reservation = await reservationModel.findById(id).populate([
                {
                    path: 'business_post',
                    model: 'BusinessPost',
                    populate: {
                        path: 'user',
                        model: 'User'
                    }
                },
                {
                    path: 'user',
                    model: 'User'
                },
                {
                    path: 'slot',
                    model: 'Slot'
                }
            ]);
            
            let reservationUpdate = await reservationModel.findOneAndUpdate({_id: id},{is_canceled: 1});
            
            if(reservation.user._id!=user_id)
            {
                if(reservation.user.is_notification_on==1)
                {
                    let title = "Reservation Canceled";
                    let description = "Your reservation is canceled from authority";
                    console.log(reservation.user.device_token,);
                    sendPushNotification(title,description,reservation.user.device_token);
                    await notificationModel.create({user:reservation.user._id,title,description,image:reservation.business_post.image});
                }
            }
            else
            {
                if(reservation.business_post.user.is_notification_on==1)
                {
                    let title = "Reservation Canceled";
                    let description = "Your reservation is canceled from user";
                    console.log(reservation.business_post.user.device_token);
                    sendPushNotification(title,description,reservation.business_post.user.device_token);
                    await notificationModel.create({user:reservation.business_post.user._id,title,description,image:reservation.business_post.image});
                }          
            }
    
            res.status(200).send({
                success: true,
                message: "Reservations Canceled Successfully"
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching or canceling reservations',
                error: error.message
            });
        }
    },
    
    


    
};

// Export reservationController
module.exports = reservationController;