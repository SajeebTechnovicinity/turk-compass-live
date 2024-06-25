// Import necessary modules
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { uploadImageToCloudinary, isBase64Image } = require("../utils/helper");
const { AuthUser } = require("../utils/helper");
const durationSlotModel = require("../models/durationSlotModel");
const businessPostModel = require("../models/businessPostModel");
const jobProfileModel = require("../models/jobProfileModel");
// Define profile Controller methods
const profileController = {
  // Method to create a new businessPost
  create: async (req, res) => {
    let { user_name, email, password, package_type } = req.body;
    try {
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
        usertype: "client",
        package_type,
      });

      res.status(201).send({
        success: true,
        message: "User Created Successfully",
        userInfo,
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
      user_id = user_info.id;

      const userCount = await userModel.countDocuments({ _id: user_id });

      if (userCount==0) {
        return res.status(401).send({
          success: true,
          message: "Unauthorized access",
          errors: [
            {
              code: "401",
              message: "Unauthorized",
            },
          ],
        });
      }
      const profile = await userModel.findById(user_id);

      res.status(200).send({
        success: true,
        message: "User Profile Retrieved Successfully",
        profile,
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
  allProfile: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let user_id = searchParams.get("id");

      const businessProfile = await businessPostModel
        .findOne({ user: user_id })
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
        ]);
      const jobProfile = await jobProfileModel
        .findOne({ user_id: user_id })
        .populate([
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
        ]);
      const generalProfile = await userModel.findOne({ _id: user_id });

      res.status(200).send({
        success: true,
        message: "All Profile Retrieved Successfully",
        businessProfile,
        jobProfile,
        generalProfile,
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
  businessProfilelist: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      user_id = user_info.id;

      const userCount = await userModel.countDocuments({ _id: user_id });

      if (userCount==0) {
        return res.status(401).send({
          success: true,
          message: "Unauthorized access",
          errors: [
            {
              code: "401",
              message: "Unauthorized",
            },
          ],
        });
      }

      const businessProfile = await businessPostModel
        .findOne({ user: user_id })
        .populate({
          path: "tag",
          model: "Tag",
        });

      res.status(200).send({
        success: true,
        message: "User Profile Retrieved Successfully",
        businessProfile,
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
  update: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      user_id = user_info.id;
      let {
        duration,
        is_reservation_available,
        is_multiple_reservation_available,
      } = req.body;
      const businessPostCount = await businessPostModel.countDocuments({
        user: user_id,
      });
      if (businessPostCount == 0) {
        return res.status(200).send({
          success: false,
          message: "Please Business Profile Create first",
          error: "Please Business Profile Create first",
        });
      }
      const userDetails = await userModel.find({ _id: user_id });
      if (userDetails.slot_duration > 0) {
        duration = user_info.slot_duration;
      }
      const profile = await userModel.findOneAndUpdate(
        { _id: user_id },
        {
          slot_duration: duration,
          is_reservation_available,
          is_multiple_reservation_available,
        }
      );
      const business_post_Update = await businessPostModel.findOneAndUpdate(
        { user: user_id },
        { is_reservation_available, is_multiple_reservation_available }
      );

      const startTime = new Date().setHours(0, 0, 0, 0); // Start from midnight
      const endTime = new Date().setHours(23, 59, 59, 999); // End at 11:59:59 PM

      const slots = [];
      let currentTime = startTime;

      let alreadySlotCreated = await durationSlotModel.countDocuments({
        duration: duration,
        is_delete: 0,
      });

      if (alreadySlotCreated > 0) {
        return res.status(200).send({
          success: true,
          message: "User Profile Retrieved Successfully",
          profile,
        });
      }

      // Iterate through the day and create slots based on the provided duration
      while (currentTime < endTime) {
        const slotStartTime = new Date(currentTime);
        const slotEndTime = new Date(currentTime + duration * 60000); // Convert minutes to milliseconds

        // Format the slot start and end times
        const formattedSlotStartTime = slotStartTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedSlotEndTime = slotEndTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Push the slot information into the array
        slots.push({
          startTime: formattedSlotStartTime,
          endTime: formattedSlotEndTime,
        });

        await durationSlotModel.create({
          start_time: formattedSlotStartTime,
          end_time: formattedSlotEndTime,
          duration: duration,
        });
        // Move to the next slot
        currentTime = slotEndTime.getTime();
      }

      res.status(200).send({
        success: true,
        message: "User Profile Retrieved Successfully",
        profile,
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

  deviceTokenupdate: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      user_id = user_info.id;
      let { device_token } = req.body;

      const userDetails = await userModel.find({ _id: user_id });

      const profile = await userModel.findOneAndUpdate(
        { _id: user_id },
        { device_token: device_token }
      );

      res.status(200).send({
        success: true,
        message: "Device Token Updated Successfully",
        profile,
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

  jobProfileCreateUpdate: async (req, res) => {
    try {
      var {
        expart,
        addition_info,
        phone,
        email,
        name,
        photo,
        total_experience,
        country,
        city,
        state,
        gender,
        summary,
        work_history,
        work_visa,
        education,
        skill,
        language,
        eligibility,
        defalut_cv,
      } = req.body;

      const user_info = await AuthUser(req);
      var user_id = user_info.id;

      if (defalut_cv) {
        defalut_cv = await uploadImageToCloudinary(defalut_cv);
      }
      if (photo) {
        photo = await uploadImageToCloudinary(photo);
      }
      var profile_info;
      let is_created = await jobProfileModel.findOne({ user_id: user_id });
      var query = {};
      if (summary) {
        query = { summary: summary };
      }
      if (work_history) {
        query = { work_history: work_history };
      }
      if (work_visa) {
        query = { work_visa: work_visa };
      }
      if (education) {
        query = { education: education };
      }
      if (skill) {
        query = { skill: skill };
      }
      if (language) {
        query = { language: language };
      }
      if (eligibility) {
        query = { eligibility: eligibility };
      }
      if (defalut_cv) {
        if (defalut_cv == "delete") {
          query = { defalut_cv: "" };
        } else {
          query = { defalut_cv: defalut_cv, cv_upload_date: new Date() };
        }
      }

      if (photo) {
        query = { photo };
      }
      if (country && city && state) {
        query = { country, city, state };
      }
      if (gender) {
        query = { gender };
      }
      if (name) {
        query = { name };
      }
      if (total_experience) {
        query = { total_experience };
      }
      if (expart) {
        query = { expart };
      }
      if (addition_info) {
        query = { addition_info };
      }
      if (name && phone && email) {
        query = { name, expart, phone, email };
      }

      if (is_created) {
        profile_info = await jobProfileModel.findOneAndUpdate(
          { user_id: user_id },
          query
        );
      } else {
        query = { ...query, user_id };
        profile_info = await jobProfileModel.create(query);
      }

      res.status(200).send({
        success: true,
        message: "Successfully updated",
        query,
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
  jobProfileGet: async (req, res) => {
    const user_info = await AuthUser(req);
    user_id = user_info.id;
    var profile_info = await jobProfileModel
      .findOne({ user_id: user_id })
      .populate([
        {
          path: "city",
          model: "City",
        },
      ])
      .populate([
        {
          path: "state",
          model: "State",
        },
      ])
      .populate([
        {
          path: "country",
          model: "Country",
        },
      ]);

    res.status(200).send({
      success: true,
      message: "Successfully",
      profile_info,
    });
  },
  generalInfoUpdate: async (req, res) => {
    try {
      var { name, photo, cover_photo } = req.body;
      var updateObj = {};
      if (photo) {
        let is_base64 = await isBase64Image(photo);
        if (is_base64) {
          photo = await uploadImageToCloudinary(photo);
          updateObj = { ...updateObj, photo };
        }
      }
      if (cover_photo) {
        let is_base64 = await isBase64Image(cover_photo);
        if (is_base64) {
          cover_photo = await uploadImageToCloudinary(cover_photo);
          updateObj = { ...updateObj, cover_photo };
        }
      }
      if (name) {
        let userName = name;
        updateObj = { ...updateObj, userName };
      }
      const user_info = await AuthUser(req);
      user_id = user_info.id;

      var update = await userModel.findOneAndUpdate(
        { _id: user_id },
        updateObj
      );
      let userInfo = await userModel.findOne({ _id: user_id });
      res.status(200).send({
        success: true,
        message: "Profile Successfully Updated",
        userInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in fetching",
        error: error.message,
      });
    }
  },
  generalInfoGet: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      user_id = user_info.id;
      const userCount = await userModel.countDocuments({ _id: user_id });

      if (userCount==0) {
        return res.status(401).send({
          success: true,
          message: "Unauthorized access",
          errors: [
            {
              code: "401",
              message: "Unauthorized",
            },
          ],
        });
      }

      let userInfo = await userModel.findOne({ _id: user_id });
      res.status(200).send({
        success: true,
        userInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in fetching",
        error: error.message,
      });
    }
  },
  delteProfile: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      user_id = user_info.id;
      let userInfo = await userModel.findOneAndUpdate(
        { _id: user_id },
        { is_delete: true }
      );
      res.status(200).send({
        success: true,
        message: "Successfully Account Deleted",
        userInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in fetching",
        error: error.message,
      });
    }
  },
  profileActiveInactive: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let id = searchParams.get("id");
      let user = await userModel.findOne({ _id: id });
      let userInfo = await userModel.findOneAndUpdate(
        { _id: id },
        { is_delete: !user.is_delete }
      );
      res.status(200).send({
        success: true,
        message: "Successfully Status Updated",
        userInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in fetching",
        error: error.message,
      });
    }
  },

  profileStatusActiveInactive:async (req, res) =>{
    try{
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let id = searchParams.get('id');
      let user=await userModel.findOne({_id:id});
      let userInfo=await userModel.findOneAndUpdate({_id:id},{status:user.status==1?0:1});
        res.status(200).send({
            success: true,
            message: 'Successfully Status Updated',
            userInfo
        });
    }catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in fetching',
            error: error.message
        });
    }
},
  businessProfileActiveInactive: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let id = searchParams.get("id");
      let businessProfile = await businessPostModel.findOne({ _id: id });
      let userInfo = await businessPostModel.findOneAndUpdate(
        { _id: id },
        { is_delete: !businessProfile.is_delete }
      );
      res.status(200).send({
        success: true,
        message: "Successfully Status Updated",
        userInfo,
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
  languageUpdate: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      user_id = user_info.id;
      const { language } = req.body;
      const profile = await userModel.findOneAndUpdate(
        { _id: user_id },
        { language: language }
      );

      res.status(200).send({
        success: true,
        message: "Language Update Successfully",
        profile,
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

// Export profileController
module.exports = profileController;
