// Import necessary modules
const businessPostModel = require("../models/businessPostModel");
const reservationModel = require("../models/reservationModel");
const slotModel = require("../models/slotModel");
const { AuthUser } = require("../utils/helper");
const { ObjectId } = require('mongodb');

// Define reservationController methods
const reservationController = {
    // Method to create a new reservation
    create: async (req, res) => {
        const { business_post,slot,number_of_person,note } = req.body;
        const user_info= await AuthUser(req);
        const user_id=user_info.id;
        try {
            const slotDetails=await slotModel.findOne({_id:slot});
            const reservationInfo = await reservationModel.create({ user:user_id,business_post,slot,duration_slot:slotDetails.duration_slot,number_of_person,note });

            // Find and update slot
            const updatedSlot = await slotModel.findOneAndUpdate(
                { _id: slot },
                { $inc: { amount_of_reservation: 1 } }, // Increment amount_of_reservation by 1
                { new: true } // Return the updated document
            );

            res.status(201).send({
                success: true,
                message: "Reservation Created Successfully",
                reservationInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating reservation',
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
                const slots = await slotModel.find({ date });
    
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
    }
    
    


    
};

// Export reservationController
module.exports = reservationController;