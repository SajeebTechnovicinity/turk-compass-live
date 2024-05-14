// Import necessary modules
const stateModel = require("../models/stateModel");
const { AuthUser } = require("../utils/helper");

// Define countryController methods
const stateController = {
    // Method to create a new state
    create: async (req, res) => {
        const { name,country } = req.body;
        try {
            const stateInfo = await stateModel.create({ name,country });
            res.status(201).send({
                success: true,
                message: "State Created Successfully",
                stateInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating state',
                error: error.message
            });
        }
    },

    // Method to list all states
    list: async (req, res) => {
        try {
            const states = await stateModel.find().populate([   
                {
                    'path':"country",
                    'model':'Country'
                },
            ]).sort({createdAt:-1});
            res.status(200).send({
                success: true,
                message: "States Retrieved Successfully",
                states
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching states',
                error: error.message
            });
        }
    }
};

// Export stateController
module.exports = stateController;
