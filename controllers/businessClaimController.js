// Import necessary modules
const businessPostModel = require("../models/businessPostModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { uploadImageToCloudinary } = require("../utils/helper");
const { AuthUser } = require("../utils/helper");
const whistlistModel = require("../models/whistlistModel");
const tagModel = require("../models/tagModel");
const businessClaimModel = require("../models/businessClaimModel");

// Define businessPostController methods
const businessClaimController = {
  // Method to create a new businessPost
  create: async (req, res) => {
    let {
      user,
      business_post,
      contact_name,
      contact_email,
      contact_phone,
      business_name,
      business_phone,
      supporting_document,
      message,
    } = req.body;
    console.log(req.body);
    const user_info = await AuthUser(req);
    const userId = user_info.id;
    try {
      if (supporting_document != null && supporting_document != "") {
        supporting_document = await uploadImageToCloudinary(
          supporting_document
        );
      }

      let claimInfo = await businessClaimModel.create({
        user:userId,
        business_post,
        contact_name,
        contact_email,
        contact_phone,
        business_name,
        business_phone,
        supporting_document,
        message,
      });
      res.status(201).send({
        success: true,
        message: "Business Claimed Successfully",
        claimInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(200).send({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  },

  list: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      const userId = user_info.id;

      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let business_post = searchParams.get("business_post");

      let page = Number(searchParams.get("page")) || 1;
      let limit = Number(searchParams.get("limit")) || 12;
      let skip = (page - 1) * limit;

      let query = { status: 0 };

      if (business_post != null) {
        query = { business_post: business_post, status: 0 };
      }

      const count = await businessClaimModel.countDocuments(query);

      const totalPages = Math.ceil(count / limit);

      const businessClaims = await businessClaimModel
        .find(query)
        .populate([
          { path: "user", model: "User" },
          { path: "business_post", model: "BusinessPost" },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).send({
        success: true,
        message: "Business Claims Retrieved Successfully",
        totalPages,
        totalCount: count,
        currentPage: page,
        businessClaims,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in fetching categories",
        error: error.message,
      });
    }
  },
};

// Export businessPostController
module.exports = businessClaimController;
