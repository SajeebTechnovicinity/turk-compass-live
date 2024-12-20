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
const businessPostController = {
  // Method to create a new businessPost
  create: async (req, res) => {
    let {
      user_id,
      user_name,
      email,
      password,
      tag,
      contact_email,
      speciality,
      category,
      sub_category,
      business_name,
      description,
      image,
      cover_image,
      address,
      country,
      state,
      city,
      contact_address,
      contact_located_in,
      contact_phone,
      contact_website,
      is_exempt,
    } = req.body;
    console.log(req.body);
    try {
      let is_reservation_available;
      let is_multiple_reservation_available;

      if (country == null || country=='') {
        return res.status(200).send({
          success: false,
          message: "Country is required",
        });
      }
      if (state== null || state=='') {
        return res.status(200).send({
          success: false,
          message: "State is required",
        });
      }
      if (city== null || city=='') {
        return res.status(200).send({
          success: false,
          message: "City is required",
        });
      }
      if ((user_name != null) & (email != null) && password != null) {
        // check
        const exisiting = await userModel.findOne({ email });

        if (exisiting) {
          return res.status(200).send({
            success: false,
            message: "Email already Registerd",
          });
        }
        //hashing the password
        const hashPassword = await bcrypt.hash(password, 10);

        const userInfo = await userModel.create({
          userName: user_name,
          email,
          password: hashPassword,
          usertype: "business-owner",
        });

        user_id = userInfo._id;
        is_multiple_reservation_available =
          userInfo.is_multiple_reservation_available;
        is_reservation_available = userInfo.is_reservation_available;
      } else {
        const user_info = await AuthUser(req);
        user_id = user_info.id;
        is_multiple_reservation_available =
          user_info.is_multiple_reservation_available;
        is_reservation_available = user_info.is_reservation_available;
      }

      let businessPostCount = await businessPostModel.countDocuments({
        user: user_id,
      });
      console.log(businessPostCount);

      if (businessPostCount > 0) {
        return res.status(200).send({
          success: false,
          message: "Already a business post created for this user",
        });
      }

      //upload image & cover image
      if (image != null && image != "") {
        image = await uploadImageToCloudinary(image);
      } else {
        image = null;
      }
      if (cover_image != null && cover_image != "") {
        cover_image = await uploadImageToCloudinary(cover_image);
      } else {
        cover_image = null;
      }
      // image = await uploadImageToCloudinary(image);
      // cover_image = await uploadImageToCloudinary(cover_image);

      const businessPostInfo = await businessPostModel.create({
        user: user_id,
        contact_email,
        tag,
        category,
        sub_category,
        speciality,
        country,
        state,
        city,
        business_name,
        description,
        image,
        cover_image,
        address,
        country,
        state,
        city,
        contact_address,
        contact_located_in,
        contact_phone,
        contact_website,
        is_reservation_available,
        is_multiple_reservation_available,
        is_exempt,
      });
      res.status(201).send({
        success: true,
        message: "Business Profile Created Successfully",
        businessPostInfo,
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

  // Method to edit businessPost
  edit: async (req, res) => {
    let {
      tag,
      contact_email,
      speciality,
      category,
      sub_category,
      business_name,
      description,
      image,
      cover_image,
      address,
      country,
      state,
      city,
      contact_address,
      contact_located_in,
      contact_phone,
      contact_website,
      is_exempt,
    } = req.body;
    console.log(req.body);
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let businessPostId = searchParams.get("id");
      let is_reservation_available;
      let is_multiple_reservation_available;

      let businessPostCount = await businessPostModel.countDocuments({
        _id: businessPostId,
      });
      if (businessPostCount == 0) {
        res.status(200).send({
          success: false,
          message: "No Business Post available",
        });
      }
      let businessPostDetails = await businessPostModel.findOne({
        _id: businessPostId,
      });

      if (businessPostDetails.is_delete == true) {
        return res.status(200).send({
          success: false,
          message: "Business post is inactived",
        });
      }
      //upload image & cover image
      if (image != null && image != "") {
        image = await uploadImageToCloudinary(image);
      } else {
        image = businessPostDetails.image;
      }
      if (cover_image != null && cover_image != "") {
        cover_image = await uploadImageToCloudinary(cover_image);
      } else {
        cover_image =  businessPostDetails.cover_image;
      }

      const businessPostInfo = await businessPostModel.findOneAndUpdate(
        { _id: businessPostDetails._id },
        {
          contact_email,
          tag,
          category,
          sub_category,
          speciality,
          country,
          state,
          city,
          business_name,
          description,
          image,
          cover_image,
          address,
          country,
          state,
          city,
          contact_address,
          contact_located_in,
          contact_phone,
          contact_website,
          is_reservation_available,
          is_multiple_reservation_available,
          is_exempt,
        }
      );
      res.status(201).send({
        success: true,
        message: "Business Post Updated Successfully",
        businessPostInfo,
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
      let sub_category = searchParams.get("sub_category");

      let page = Number(searchParams.get("page")) || 1;
      let limit = Number(searchParams.get("limit")) || 12;
      let skip = (page - 1) * limit;

      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);

      // let query = { is_delete: false,createdAt: { $gte: thirtyDaysAgo }};
      let query = { is_delete: false };

      if (sub_category != null) {
        // query = { sub_category: sub_category, is_delete: false,createdAt: { $gte: thirtyDaysAgo }};
        query = { sub_category: sub_category, is_delete: false };
      }

      const count = await businessPostModel.countDocuments(query);

      const totalPages = Math.ceil(count / limit);

      const businessPosts = await businessPostModel
        .find(query)
        .populate([
          { path: "category", model: "Category" },
          { path: "sub_category", model: "SubCategory" },
          { path: "user", model: "User" },
          { path: "country", model: "Country" },
          { path: "state", model: "State" },
          { path: "city", model: "City" },
          { path: "tag", model: "Tag" },
        ])
        .sort({ business_name: 1 })
        .skip(skip)
        .limit(limit);

      // Check if each business post is in the user's wishlist
      const businessPostsWithWishlistInfo = await Promise.all(
        businessPosts.map(async (post) => {
          const wishlistEntry = await whistlistModel.countDocuments({
            user: userId,
            business_post: post._id,
          });

          return {
            ...post.toObject(),
            is_wishlist: wishlistEntry,
          };
        })
      );

      res.status(200).send({
        success: true,
        message: "Business Posts Retrieved Successfully",
        totalPages,
        totalCount: count,
        currentPage: page,
        businessPosts: businessPostsWithWishlistInfo,
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

  adminList: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let sub_category = searchParams.get("sub_category");
      let page = Number(searchParams.get("page")) || 1;
      let limit = Number(searchParams.get("limit")) || 12;
      let skip = (page - 1) * limit;

      let query = {};

      if (sub_category != null) {
        query = { sub_category: sub_category };
      }

      const count = await businessPostModel.countDocuments(query);

      const totalPages = Math.ceil(count / limit);

      const businessPosts = await businessPostModel
        .find(query)
        .populate([
          { path: "category", model: "Category" },
          { path: "sub_category", model: "SubCategory" },
          { path: "user", model: "User" },
          { path: "country", model: "Country" },
          { path: "state", model: "State" },
          { path: "city", model: "City" },
        ])
        .sort({ business_name: 1 })
        .skip(skip)
        .limit(limit);

      res.status(200).send({
        success: true,
        message: "Business Posts Retrieved Successfully",
        totalPages,
        currentPage: page,
        businessPosts,
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

  compareList: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      const userId = user_info.id;

      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let sub_category = searchParams.get("sub_category");

      let page = Number(searchParams.get("page")) || 1;
      let limit = Number(searchParams.get("limit")) || 12;
      let skip = (page - 1) * limit;

      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);

      // let query = { is_delete: false,createdAt: { $gte: thirtyDaysAgo }};
      let query = { is_delete: false };

      if (sub_category != null) {
        // query = { sub_category: sub_category, is_delete: false,createdAt: { $gte: thirtyDaysAgo }};
        query = { sub_category: sub_category, is_delete: false };
      }


      const count = await businessPostModel.countDocuments(query);

      const totalPages = Math.ceil(count / limit);

      const businessPosts = await businessPostModel
        .find(query)
        .populate([
          { path: "category", model: "Category" },
          { path: "sub_category", model: "SubCategory" },
          { path: "user", model: "User" },
          { path: "country", model: "Country" },
          { path: "state", model: "State" },
          { path: "city", model: "City" },
          { path: "tag", model: "Tag" },
        ])
        .sort({ business_name: 1 })
        .skip(skip)
        .limit(limit);

      // Check if each business post is in the user's wishlist
      const businessPostsWithWishlistInfo = await Promise.all(
        businessPosts.map(async (post) => {
          const wishlistEntry = await whistlistModel.countDocuments({
            user: userId,
            business_post: post._id,
          });

          return {
            ...post.toObject(),
            is_wishlist: wishlistEntry,
          };
        })
      );

      res.status(200).send({
        success: true,
        message: "Business Posts Retrieved Successfully",
        totalPages,
        totalCount: count,
        currentPage: page,
        businessPosts: businessPostsWithWishlistInfo,
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

  search: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let sub_category = searchParams.get("sub_category");
      let page = Number(searchParams.get("page")) || 1;
      let limit = Number(searchParams.get("limit")) || 12;
      let skip = (page - 1) * limit;

      const { city, name } = req.body;

      // Fetch tag document using tag name
      // const tag = await tagModel.findOne({
      //   name: { $regex: `.*${name}.*`, $options: "i" },
      // });
      const tag = await tagModel.findOne({
        $or: [
          { name: { $regex: `.*${name}.*`, $options: "i" } },
          { name_tr: { $regex: `.*${name}.*`, $options: "i" } },
        ],
      });
      //console.log("Tag"+tag);

      // Find businesses with names containing the substring
      const businesses = await businessPostModel.find({
        business_name: { $regex: `.*${name}.*`, $options: "i" },
      });

      // if (city && (tag || businesses.length > 0)) {
      //     if (tag && businesses.length > 0) {
      //         query = {
      //             sub_category: sub_category,
      //             city: city,
      //             $or: [
      //                 { tag: tag._id },
      //                 { _id: { $in: businesses.map(b => b._id) } }
      //             ]
      //         };
      //     } else if (tag) {
      //         query = {
      //             sub_category: sub_category,
      //             city: city,
      //             tag: tag._id
      //         };
      //     } else {
      //         query = {
      //             sub_category: sub_category,
      //             city: city,
      //             _id: { $in: businesses.map(b => b._id) }
      //         };
      //     }
      // }
      // else if(tag)
      // {
      //     query = {
      //         sub_category: sub_category,
      //         city: city,
      //         $or: [
      //             { tag: tag._id },
      //             { business_name: { $regex: `.*${name}.*`, $options: 'i' } }
      //         ]
      //     };
      // }
      // else {
      //     query = { sub_category: sub_category };
      // }

      if (name != null && city != null) {
        if (tag) {
          query = {
            sub_category: sub_category,
            city: city,
            $or: [
              { tag: tag._id },
              { business_name: { $regex: `.*${name}.*`, $options: "i" } },
            ],
          };
        } else {
          query = {
            sub_category: sub_category,
            city: city,
            business_name: { $regex: `.*${name}.*`, $options: "i" },
          };
        }
      } else if (name != null) {
        if (tag) {
          query = {
            sub_category: sub_category,
            $or: [
              { tag: tag._id },
              { business_name: { $regex: `.*${name}.*`, $options: "i" } },
            ],
          };
        } else {
          query = {
            sub_category: sub_category,
            business_name: { $regex: `.*${name}.*`, $options: "i" },
          };
          console.log(query);
        }
      } else if (city != null) {
        query = {
          sub_category: sub_category,
          city: city,
        };
      } else {
        query = {
          sub_category: sub_category,
        };
      }

      const count = await businessPostModel.countDocuments(query);
      const totalPages = Math.ceil(count / limit);

      const businessPosts = await businessPostModel
        .find(query)
        .populate([
          {
            path: "category",
            model: "Category",
          },
          {
            path: "sub_category",
            model: "SubCategory",
          },
          {
            path: "user",
            model: "User",
          },
          {
            path: "country",
            model: "Country",
          },
          {
            path: "state",
            model: "State",
          },
          {
            path: "city",
            model: "City",
          },
          {
            path: "tag",
            model: "Tag",
          },
        ])
        .sort({ business_name: 1 })
        .skip(skip)
        .limit(limit);

      res.status(200).send({
        success: true,
        message: "Business Posts Retrieved Successfully",
        totalPages,
        currentPage: page,
        businessPosts,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in fetching business posts",
        error: error.message,
      });
    }
  },

  details: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let user_id = searchParams.get("user_id");

      const profile = await userModel.findById(user_id);

      const businessCount = await businessPostModel.countDocuments({
        user: user_id,
      });

      if (businessCount <= 0) {
        return res.status(403).send({
          success: false,
          message: "User does not have any business",
        });
      }

      const businessProfile = await businessPostModel
        .findOne({ user: user_id })
        .populate({
          path: "user",
          model: "User",
        });

      const user_info = await AuthUser(req);
      const userId = user_info.id;

      const claimCount = await businessClaimModel.countDocuments({
        user: userId,
        business_post: businessProfile._id,
      });

      const claimApproveCount = await businessClaimModel.countDocuments({
        // user: userId,
        business_post: businessProfile._id,
        status: 1,
      });

      res.status(200).send({
        success: true,
        message: "User Profile Retrieved Successfully",
        businessProfile,
        claimCount,
        claimApproveCount,
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

  idWiseDetails: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let id = searchParams.get("id");

      // const profile = await userModel.findById(user_id);
      const businessProfile = await businessPostModel.findOne({ _id: id });

      const user_info = await AuthUser(req);
      const userId = user_info.id;

      const claimCount = await businessClaimModel.countDocuments({
        user: userId,
        business_post: id,
      });

      const claimApproveCount = await businessClaimModel.countDocuments({
        // user: userId,
        business_post: businessProfile._id,
        status: 1,
      });

      res.status(200).send({
        success: true,
        message: "User Profile Retrieved Successfully",
        businessProfile,
        claimCount,
        claimApproveCount,
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

   // Method to edit businessPost
   updateAddress: async (req, res) => {


    let message=null;
    let {
      address,
    } = req.body;
    console.log(req.body);
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let businessPostId = searchParams.get("id");
      let is_reservation_available;
      let is_multiple_reservation_available;

      let businessPostCount = await businessPostModel.countDocuments({
        _id: businessPostId,
      });
      if (businessPostCount == 0) {
        res.status(200).send({
          success: false,
          message: "No Business Post available",
        });
      }
      let businessPostDetails = await businessPostModel.findOne({
        _id: businessPostId,
      });

      if (businessPostDetails.is_delete == true) {
        return res.status(200).send({
          success: false,
          message: "Business post is inactived",
        });
      }

      if(address==businessPostDetails.address){
        message="Igore Address Update";
      }
      else{
        message="Address Updated";
      }

      const businessPostInfo = await businessPostModel.findOneAndUpdate(
        { _id: businessPostDetails._id },
        {
          address: address,
          is_compare: true
        }
      );
      res.status(201).send({
        success: true,
        message: message,
        businessPostInfo,
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


};

// Export businessPostController
module.exports = businessPostController;
