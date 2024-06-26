// Import necessary modules
const countryModel = require("../models/countryModel");
const { AuthUser } = require("../utils/helper");

// Define countryController methods
const countryController = {
    // Method to create a new country
    create: async (req, res) => {
        const { name } = req.body;
        try {
            const countryInfo = await countryModel.create({ name });
            res.status(201).send({
                success: true,
                message: "Country Created Successfully",
                countryInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating country',
                error: error.message
            });
        }
    },

    // Method to list all countries
    list: async (req, res) => {
        try {
            const countries = await countryModel.find().sort({ name: 1, createdAt: -1 });;
            res.status(200).send({
                success: true,
                message: "Countries Retrieved Successfully",
                countries
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching countries',
                error: error.message
            });
        }
    }
};

// Export countryController
module.exports = countryController;
