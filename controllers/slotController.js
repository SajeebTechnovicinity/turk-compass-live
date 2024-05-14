// Import necessary modules
const slotModel = require("../models/slotModel");
const { AuthUser } = require("../utils/helper");

// Define slotController methods
const slotController = {
    // Method to create a new slot
    create: async (req, res) => {
        const { business_post,duration, from_date, to_date } = req.body;
        try {
            // Iterate through each date within the range
            const currentDate = new Date(from_date);
            const endDate = new Date(to_date);
            const slots = [];
    
            while (currentDate <= endDate) {
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
                        date: currentDate,
                        startTime: formattedSlotStartTime,
                        endTime: formattedSlotEndTime
                    });
                    const countryInfo = await slotModel.create({
                        business_post:business_post,
                        date: currentDate,
                        start_time: formattedSlotStartTime,
                        end_time: formattedSlotEndTime,
                        duration:duration,
                        amount_of_reservation:0
                    });
                    // Move to the next slot
                    currentTime = slotEndTime.getTime();
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
    
    // Method to list all categories
    list: async (req, res) => {
        try {
            const categories = await slotModel.find();
            res.status(200).send({
                success: true,
                message: "Categories Retrieved Successfully",
                categories
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
