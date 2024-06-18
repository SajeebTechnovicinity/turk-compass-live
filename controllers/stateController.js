// Import necessary modules
const stateModel = require("../models/stateModel");
const { AuthUser } = require("../utils/helper");

// Define countryController methods
const stateController = {
  // Method to create a new state
  create: async (req, res) => {
    const { name, country } = req.body;
    try {
      const stateInfo = await stateModel.create({ name, country });
      res.status(201).send({
        success: true,
        message: "State Created Successfully",
        stateInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in creating state",
        error: error.message,
      });
    }
  },

  // Method to list all states
  list: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit"));
    let skip = (page - 1) * limit;

    try {
      const count = await stateModel.countDocuments();
      const totalPages = Math.ceil(count / limit);
      let states;
      if (limit == null || limit == undefined || limit == "") {
        states = await stateModel
          .find()
          .populate([
            {
              path: "country",
              model: "Country",
            },
          ])
          .sort({ createdAt: -1 });
      } else {
        states = await stateModel
          .find()
          .populate([
            {
              path: "country",
              model: "Country",
            },
          ])
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      }
      res.status(200).send({
        success: true,
        message: "States Retrieved Successfully",
        states,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in fetching states",
        error: error.message,
      });
    }
  },


  // Method to create a new state
  edit: async (req, res) => {
    const { id, name, country } = req.body;
    try {
      const stateInfo = await stateModel.updateOne(
        { _id: id },
        { name, country }
      );
      res.status(200).send({
        success: true,
        message: "State Updated Successfully",
        stateInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in creating state",
        error: error.message,
      });
    }
  },
};

// Export stateController
module.exports = stateController;
