// Import necessary modules
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
            const reservationInfo = await reservationModel.create({ user:user_id,business_post,slot,number_of_person,note });

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
            const reservations = await reservationModel.aggregate([
                {
                    $match: {
                        user: new ObjectId(user_id),
                        createdAt: { $gte: new Date(from_date), $lte: new Date(to_date) }
                    }
                },
                {
                    $lookup: {
                        from: "slots", // Assuming the collection name is "slots"
                        localField: "slot",
                        foreignField: "_id",
                        as: "slot"
                    }
                },
                {
                    $unwind: "$slot" // Unwind the slot array created by the $lookup stage
                },
                {
                    $group: {
                        _id: {
                            slot: "$slot",
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                        },
                        reservations: { $push: "$$ROOT" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$_id.slot",
                        dates: {
                            $push: {
                                date: "$_id.slot.date",
                                reservations: "$reservations",
                                count: "$count"
                            }
                        }
                    }
                }
            ]);
        
            // Reformatting the result to match the desired structure
            const formattedReservations = {};
            reservations.forEach(item => {
                formattedReservations[item._id._id] = {};
                item.dates.forEach(date => {
                    formattedReservations[item._id._id][date.date] = {
                        reservations: date.reservations,
                        count: date.count
                    };
                });
            });
        
            res.status(200).send({
                success: true,
                message: "Reservations Retrieved Successfully",
                reservations: formattedReservations
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