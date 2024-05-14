// Import necessary modules
const cityModel = require("../models/cityModel");
const { AuthUser } = require("../utils/helper");

// Define countryController methods
const cityController = {
    // Method to create a new city
    create: async (req, res) => {
        const { name,country,state } = req.body;
        try {
            const cityInfo = await cityModel.create({ name,country,state });
            res.status(201).send({
                success: true,
                message: "City Created Successfully",
                cityInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating city',
                error: error.message
            });
        }
    },

    // Method to list all citys
    list: async (req, res) => {
        try {
            const citys = await cityModel.find().populate([   
                {
                    'path':"country",
                    'model':'Country'
                },
                {
                    'path':"state",
                    'model':'State'
                },
            ]).sort({createdAt:-1});
            res.status(200).send({
                success: true,
                message: "cities Retrieved Successfully",
                citys
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

// Export cityController
module.exports = cityController;