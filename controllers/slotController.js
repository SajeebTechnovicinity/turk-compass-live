// Import necessary modules
const { duration } = require("moment");
const businessPostModel = require("../models/businessPostModel");
const durationSlotModel = require("../models/durationSlotModel");
const slotModel = require("../models/slotModel");
const { AuthUser } = require("../utils/helper");
const userModel = require("../models/userModel");
const reservationModel = require("../models/reservationModel");

// Define slotController methods
const slotController = {
    // Method to create a new slot
    create: async (req, res) => {
        const { from_date, to_date, slot_ids } = req.body;
        try {
            // Parse dates and initialize variables
            const currentDate = new Date(from_date);
            const endDate = new Date(to_date);
            const slots = [];
            const user_info = await AuthUser(req);
            const user_id = user_info.id;

            const business_post_count=await businessPostModel.countDocuments({ user: user_id });
            if(business_post_count==0)
            {
                return res.status(200).send({
                    success: false,
                    message: 'No business post available'
                });
            }
            const business_post_details = await businessPostModel.findOne({ user: user_id });
            const business_post = business_post_details._id;
            const duration = user_info.slot_duration;
    
            // Count documents within the date range
            const slotCount = await slotModel.countDocuments({
                business_post: business_post,
                date: {
                    $gte: from_date,
                    $lte: to_date
                }
            });
    
            if (slotCount > 0) {
                return res.status(200).send({
                    success: false,
                    message: 'Already slot created for this schedule'
                });
            }
    
            // Fetch all duration slots outside the loop to minimize database calls
            const durationSlots = await durationSlotModel.find({ _id: { $in: slot_ids } });
    
            // Generate slots for each date within the range
            while (currentDate <= endDate) {
                for (let durationSlot of durationSlots) {
                    if (durationSlot) {
                        slots.push({
                            business_post: business_post,
                            date: currentDate.toISOString().slice(0, 10),
                            duration_slot: durationSlot._id,
                            start_time: durationSlot.start_time,
                            end_time: durationSlot.end_time,
                            duration: durationSlot.duration,
                            amount_of_reservation: 0,
                            status: 0
                        });
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
    
            // Bulk insert slots
            await slotModel.insertMany(slots);
    
            res.status(201).send({
                success: true,
                message: "Slots Created Successfully",
                slots
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating slots',
                error: error.message
            });
        }
    },
    
    // Method to list date and business post wise slot
    list: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let business_post = searchParams.get('business_post');
        let date = searchParams.get('date');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
        try {
            const slots = await slotModel.find({business_post:business_post,date:date});
            res.status(200).send({
                success: true,
                message: "Slots Retrieved Successfully",
                slots
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
    

    // Method to list date and business post wise slot
    slotManageList: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let business_post = searchParams.get('business_post');
        let date = searchParams.get('date');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
        try {
            // Build the match object
            const match = {};
            if (business_post) match.business_post = business_post;
            if (date) match.date = date;

            let user_info= await AuthUser(req);
            user_id=user_info.id;

            let business_post_count=await businessPostModel.countDocuments({user:user_id});
            if(business_post_count==0)
            {
                return res.status(200).send({
                    success: false,
                    message: 'Please first create business profile',
                    error:'Please first create business profile'
                });
            }

            let business_post_details=await businessPostModel.findOne({user:user_id});
            business_post=business_post_details._id;

            // Aggregate slots to get the count of slots for each date and business post
            const aggregatedSlots = await slotModel.aggregate([
                { 
                    $match: { 
                        business_post: business_post
                    } 
                },
                { 
                    $group: { 
                        _id: { 
                            date: "$date", 
                            business_post: "$business_post"
                        },
                        total_slot: { $sum: 1 }, // Count the total slots
                        is_multiple_reservation_available: { $first: business_post_details.is_multiple_reservation_available }, // Get the is_multiple_reservation_available value
                        total_available_slots: { 
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$is_multiple_reservation_available", 1] }, // Check if multiple reservations are available
                                    then: "$total_slot", // If true, set total available slots same as total slots
                                    else: { $cond: { // If false, count only the slots where amount_of_reservation is 0
                                        if: { $eq: ["$amount_of_reservation", 0] },
                                        then: 1,
                                        else: 0
                                    }}
                                }
                            }
                        }  
                    } 
                },
                { 
                    $sort: { 
                        '_id.date': -1 // Sort by date in descending order
                    } 
                }
                // { 
                //     $skip: skip 
                // },
                // { 
                //     $limit: limit 
                // }
            ]);

            // Get total count for pagination
            const totalSlots = await slotModel.countDocuments(match);

            res.status(200).send({
                success: true,
                message: "Slots Retrieved Successfully",
                slots:aggregatedSlots,
                data: {
                    totalSlots,
                    page,
                    totalPages: Math.ceil(totalSlots / limit),
                },
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                success: false,
                message: error.message,
                error: error.message,
            });
        }
    },

    durationWise: async (req, res) => {
        const user_info= await AuthUser(req);
        user_id=user_info.id;
        // let businessPostCount=await businessPostModel.countDocuments({user:user_id});
        // console.log(businessPostCount);

        // if(businessPostCount==0)
        // {
        //     return res.status(200).send({
        //         success: false,
        //         message: 'No business post available'
        //     });
        // }
        // let business_post_details=await businessPostModel.findOne({user:user_id});
        // console.log(business_post_details);
        // let business_post=business_post_details._id;
        let userDetails=await userModel.findById(user_id);
        let duration=userDetails.slot_duration;
        console.log(duration);
        if(duration==0)
        {
           return res.status(200).send({
                success: false,
                message: "Please first set duration in settings",
                error:"Please first set duration in settings"
            });
        }

        try {
            const slots = await durationSlotModel.find({duration:duration,is_delete:0});
            res.status(200).send({
                success: true,
                message: "Slots Retrieved Successfully",
                slots
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

    dateWiseSlot: async (req, res) => {
        const { date } = req.body;
        try {
            // Parse dates and initialize variables
            const user_info = await AuthUser(req);
            const user_id = user_info.id;
            let business_post_count=await businessPostModel.countDocuments({user:user_id});
            if(business_post_count==0)
            {
                return res.status(200).send({
                    success: false,
                    message: 'Please first create business profile',
                    error:'Please first create business profile'
                });
            }
            const business_post_details = await businessPostModel.findOne({ user: user_id });
            const business_post = business_post_details._id;
            const duration = user_info.slot_duration;

            const userDetails=await userModel.findOne({_id:user_id});
            console.log(userDetails);
            // Fetch all duration slots outside the loop to minimize database calls
            const durationSlots = await durationSlotModel.find({ duration: userDetails.slot_duration });

 
            // Generate slots for each date within the range

             // Check if each business post is in the user's wishlist
            const slotInfo = await Promise.all(durationSlots.map(async (slot) => {
                const slotList = await slotModel.countDocuments({
                    duration_slot: slot._id,
                    date:date,
                    business_post: business_post
                });
                let slotReservation=0;
                if(slotList>0)
                {
                    slotReservation = await reservationModel.countDocuments({
                        duration_slot: slot._id,
                        slot_date:date,
                        business_post: business_post
                    });
    
                }
              

                return {
                    ...slot.toObject(),
                    is_already_added: slotList,
                    amount_of_reservation:slotReservation
                };
            }));

    
            res.status(200).send({
                success: true,
                message: "Slots Created Successfully",
                slots:slotInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating slots',
                error: error.message
            });
        }
    },


    // Method to edit an existing slot
     edit: async (req, res) => {
        const { date, slot_ids } = req.body;
        try {
            // Parse dates and initialize variables
            const currentDate = new Date(date);
            const slots = [];
            const user_info = await AuthUser(req);
            const user_id = user_info.id;

            const business_post_count=await businessPostModel.countDocuments({ user: user_id });
            if(business_post_count==0)
            {
                return res.status(200).send({
                    success: false,
                    message: 'No business post available'
                });
            }
            const business_post_details = await businessPostModel.findOne({ user: user_id });
            const business_post = business_post_details._id;
            const duration = user_info.slot_duration;

            const slotDelete=await slotModel.deleteMany({date:date,business_post:business_post});
   
            // Fetch all duration slots outside the loop to minimize database calls
            const durationSlots = await durationSlotModel.find({ _id: { $in: slot_ids } });
    
 
                for (let durationSlot of durationSlots) {
                    if (durationSlot) {
                        slots.push({
                            business_post: business_post,
                            date: currentDate.toISOString().slice(0, 10),
                            duration_slot: durationSlot._id,
                            start_time: durationSlot.start_time,
                            end_time: durationSlot.end_time,
                            duration: durationSlot.duration,
                            amount_of_reservation: 0,
                            status: 0
                        });
                    }
                }
    
            // Bulk insert slots
            await slotModel.insertMany(slots);
    
            res.status(200).send({
                success: true,
                message: "Slots Updated Successfully",
                slots
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating slots',
                error: error.message
            });
        }
    },


    // Method to edit an existing slot
    // Method to edit an existing slot
    delete: async (req, res) => {
        const { date, slot_ids } = req.body;
        try {
            // Parse dates and initialize variables
            const currentDate = new Date(date);
            const slots = [];
            const user_info = await AuthUser(req);
            const user_id = user_info.id;

            const business_post_count=await businessPostModel.countDocuments({ user: user_id });
            if(business_post_count==0)
            {
                return res.status(200).send({
                    success: false,
                    message: 'No business post available'
                });
            }
            const business_post_details = await businessPostModel.findOne({ user: user_id });
            const business_post = business_post_details._id;
            const duration = user_info.slot_duration;

            const slotReservationCount=await slotModel.countDocuments({date:date,business_post:business_post, amount_of_reservation: { $gt: 0 }});
            console.log(slotReservationCount);
            if(slotReservationCount>0)
            {
                return res.status(200).send({
                    success: false,
                    message: "Not Possible to delete. As a reservation exists in your date",
                });
            }

            const slotDelete=await slotModel.deleteMany({date:date,business_post:business_post});
   
    
            res.status(200).send({
                success: true,
                message: "Slots Deleted Successfully",
                slots
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating slots',
                error: error.message
            });
        }
    },


};




// Export slotController
module.exports = slotController;
