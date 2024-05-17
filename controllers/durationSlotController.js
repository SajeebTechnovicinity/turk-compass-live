// Import necessary modules
const businessPostModel = require("../models/businessPostModel");
const durationSlotModel = require("../models/durationSlotModel");
const slotModel = require("../models/slotModel");
const { AuthUser } = require("../utils/helper");

// Define durationSlotController methods
const durationSlotController = {
    // Method to create a new slot
    beforeCreate: async (req, res) => {
        const { from_date, to_date } = req.body;
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

            await durationSlotModel.findOneAndUpdate({business_post:business_post},{is_delete:1})

            // Count documents within the date range
            const slotCount = await slotModel.countDocuments({
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
            // Assuming the slots start from 12:00 AM to 11:59 PM for each date
            const startTime = new Date(currentDate).setHours(0, 0, 0, 0); // Start from midnight
            const endTime = new Date(currentDate).setHours(23, 59, 59, 999); // End at 11:59:59 PM
            let currentTime = startTime;

            // Iterate through the day and create slots based on the provided duration
            while (currentTime < endTime) {
                const slotStartTime = new Date(currentTime);
                const slotEndTime = new Date(currentTime + duration * 60000); // Convert minutes to milliseconds

                // Format the slot start and end times
                const formattedSlotStartTime = slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const formattedSlotEndTime = slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Push the slot information into the array
                slots.push({
                    startTime: formattedSlotStartTime,
                    endTime: formattedSlotEndTime
                });
                const countryInfo = await slotModel.create({
                    business_post:business_post,
                    start_time: formattedSlotStartTime,
                    end_time: formattedSlotEndTime,
                    duration:duration,
                });
                // Move to the next slot
                currentTime = slotEndTime.getTime();
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
    }
};

// Export durationSlotController
module.exports = durationSlotController;
