// Import necessary modules
const businessPostModel = require("../models/businessPostModel");
const durationSlotModel = require("../models/durationSlotModel");
const slotModel = require("../models/slotModel");
const { AuthUser } = require("../utils/helper");

// Define slotController methods
const slotController = {
    // Method to create a new slot
    create: async (req, res) => {
        const { from_date, to_date,slot_ids } = req.body;
        let business_post,duration;
        try {
            // Iterate through each date within the range
            const currentDate = new Date(from_date);
            const endDate = new Date(to_date);
            const slots = [];
            const user_info= await AuthUser(req);
            user_id=user_info.id;
            let business_post_details=await businessPostModel.findOne({user:user_id});
            business_post=business_post_details._id;
            duration=user_info.slot_duration;

            // Count documents within the date range
            const slotCount = await slotModel.countDocuments({
                business_post:business_post,
                date: {
                    $gte: from_date,
                    $lte: to_date
                }
            });
            console.log(slotCount);
            if(slotCount>0)
            {
                return res.status(200).send({
                    success: false,
                    message: 'Already slot created for this schedule'
                });
            }
    
            while (currentDate <= endDate) {
                
                for (let slotId of slot_ids) {
                   
                    let durationSlot = await durationSlotModel.findById(slotId);
                    if (durationSlot) {
                         console.log("hello");
                        const countryInfo = await slotModel.create({
                            business_post: business_post,
                            date: currentDate.toISOString().slice(0, 10),
                            duration_slot: slotId,
                            start_time: durationSlot.start_time,
                            end_time: durationSlot.end_time,
                            duration: durationSlot.duration,
                            amount_of_reservation: 0,
                            status: 0
                        });
                    }
                }
                // Move to the next date
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
    
            // Here, you can save the slots into your database if needed
            // For demonstration purposes, I'm just sending the slots in the response
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

        // Aggregate slots to get the count of slots for each date and business post
        const aggregatedSlots = await slotModel.aggregate([
            { 
                $match: { 
                    amount_of_reservation: 0 // Filter slots where amount_of_reservation is 0
                } 
            },
            { 
                $group: { 
                    _id: { 
                        date: "$date", 
                        business_post: "$business_post",
                        total_slot: { $sum: 1 }, 
                        total_available_slots: { 
                            $sum: 1 // Sum the available slots
                        } 
                    },
                   
                    
                } 
            },
            { 
                $skip: skip 
            },
            { 
                $limit: limit 
            }
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
        res.status(500).send({
            success: false,
            message: 'Error in fetching slots',
            error: error.message,
        });
    }
    },

    durationWise: async (req, res) => {
        const user_info= await AuthUser(req);
        user_id=user_info.id;
        let businessPostCount=await businessPostModel.countDocuments({user:user_id});
        console.log(businessPostCount);

        if(businessPostCount==0)
        {
            return res.status(200).send({
                success: false,
                message: 'No business post available'
            });
        }
        let business_post_details=await businessPostModel.findOne({user:user_id});
        console.log(business_post_details);
        business_post=business_post_details._id;
        duration=user_info.slot_duration;
        try {
            const slots = await durationSlotModel.find({business_post:business_post,is_delete:0});
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
    }
};

// Export slotController
module.exports = slotController;
