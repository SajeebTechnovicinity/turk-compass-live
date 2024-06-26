// Import necessary modules
const businessPostModel = require("../models/businessPostModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { uploadImageToCloudinary } = require("../utils/helper");
const { AuthUser } = require("../utils/helper");
const whistlistModel = require("../models/whistlistModel");
const tagModel = require("../models/tagModel");
const businessClaimModel = require("../models/businessClaimModel");
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

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
        user: userId,
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

  approve: async (req, res) => {
    
    try {
        const password = "12345678Aa";
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let id = searchParams.get("id");
      
      let businessClaim = await businessClaimModel
    .findOne({ _id: id })
    .populate([
        { path: "user", model: "User" },
        { path: "business_post", model: "BusinessPost" }
    ]);
        

      let business_post_user_id;

      if (businessClaim.user.email != businessClaim.contact_email) {
        // check
        let contact_email = businessClaim.contact_email;
        const exisiting = await userModel.findOne({ email:contact_email });

        if (exisiting) {
          return res.status(200).send({
            success: false,
            message: "Email already Registerd",
          });
        }

     
        //hashing the password
        const hashPassword = await bcrypt.hash(password, 10);

        const userInfo = await userModel.create({
          userName: businessClaim.contact_name,
          email:contact_email,
          password: hashPassword,
          usertype: "business-owner",
        });
        business_post_user_id = userInfo._id;
      } else {
        business_post_user_id = businessClaim.user._id;
      }
      let business_post_update_user = await businessPostModel.findOneAndUpdate(
        { _id: businessClaim.business_post },
        { business_post_user_id,business_name:businessClaim.business_name }
      );
      let member = await businessClaimModel.findOneAndUpdate(
        { _id: id },
        { status: 1 }
      );

      let emailTemplatePath,email_subject;
      let userDetails = await userModel.findById(business_post_user_id);
      if (userDetails.language == "tr") {
        emailTemplatePath = path.resolve(
          __dirname,
          "views",
          "mails",
          "claim_mail_turkish.ejs"
        );
        email_subject = "Türk'ün Talep Postası";
      } else {
        emailTemplatePath = path.resolve(
          __dirname,
          "views",
          "mails",
          "claim_mail.ejs"
        );
        email_subject = "Turk's Claim Mail";
      }

      const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
      const resetLink = "link";
      const mailContent = ejs.render(emailTemplate, {
        resetLink,
        name: userDetails.userName,
        password,
      });
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Set to false for explicit TLS
        auth: {
          user: "turkscompass@gmail.com",
          pass: "avrucxhaxvgdcjef",
        },
        tls: {
          // Do not fail on invalid certificates
          //rejectUnauthorized: false,
        },
      });
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: userDetails.email,
        subject: email_subject,
        html: mailContent,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);


      res.status(200).send({
        success: true,
        message: "Successfully Approved",
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
module.exports = businessClaimController;
