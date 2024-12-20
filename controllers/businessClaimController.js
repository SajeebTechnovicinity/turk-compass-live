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

      let query = { };

      if (business_post != null) {
        query = { business_post: business_post };
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

      //random password with at least one uppercase letter, one lowercase letter, one digit, and at least 8 characters in length:
      const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lowercase = "abcdefghijklmnopqrstuvwxyz";
      const digits = "0123456789";
      const allChars = uppercase + lowercase + digits;
  
      let password = "";
      password += uppercase[Math.floor(Math.random() * uppercase.length)];
      password += lowercase[Math.floor(Math.random() * lowercase.length)];
      password += digits[Math.floor(Math.random() * digits.length)];
  
      for (let i = 3; i < 8; i++) {
          password += allChars[Math.floor(Math.random() * allChars.length)];
      }
  
      // Shuffle the password to avoid predictable sequences
      password = password.split('').sort(() => 0.5 - Math.random()).join('');

      //const password = "12345678Aa";
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let id = searchParams.get("id");

      let businessClaim = await businessClaimModel
        .findOne({ _id: id })
        .populate([
          { path: "user", model: "User" },
          { path: "business_post", model: "BusinessPost" },
        ]);

      let business_post_user_id;

      if (businessClaim.user.email !== businessClaim.contact_email) {
        // check
        let contact_email = businessClaim.contact_email;
        const exisiting = await userModel.findOne({ email: contact_email });

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
          email: contact_email,
          password: hashPassword,
          package_type: "general_employer",
          usertype: "business-owner",
          claimed_account:1
        });
        business_post_user_id = userInfo._id;

        let emailTemplatePath, email_subject;
        let userDetails = await userModel.findById(business_post_user_id);
        if (userDetails.language == "tr") {
          emailTemplatePath = path.resolve(
            __dirname,
            "views",
            "mails",
            "claim_mail_turkish.ejs"
          );
          email_subject = "Turk’s Compass’a  Postası";
        } else {
          emailTemplatePath = path.resolve(
            __dirname,
            "views",
            "mails",
            "claim_mail.ejs"
          );
          email_subject = "Turk's Compass's Claim Mail";
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
            pass: "cjgwnhbsumbzgsog",
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
      } else {
        business_post_user_id = businessClaim.user._id;
        let userDetailsForBusinessPost = await userModel.findById(
          businessClaim.user._id
        );

        let businessPostCount = await businessPostModel.countDocuments({
          user: businessClaim.user._id,
        });
        if (businessPostCount > 0) {
          return res.status(200).send({
            success: false,
            message:
              "Already a Business post created for this user.Please try with another email",
          });
        }
        if (userDetailsForBusinessPost != "premium_employer") {
          await userModel.findOneAndUpdate(
            { _id: businessClaim.user._id },
            { package_type: "general_employer" }
          );
        }

        let emailTemplatePath, email_subject;
        let userDetails = await userModel.findById(business_post_user_id);
        if (userDetails.language == "tr") {
          emailTemplatePath = path.resolve(
            __dirname,
            "views",
            "mails",
            "claim_mail_old_account_turkish.ejs"
          );
          email_subject = "Turk’s Compass’a  Postası";
        } else {
          emailTemplatePath = path.resolve(
            __dirname,
            "views",
            "mails",
            "claim_mail_old_account.ejs"
          );
          email_subject = "Turk's Compass's Claim Mail";
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
            pass: "cjgwnhbsumbzgsog",
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
      }
      let business_post_update_user = await businessPostModel.findOneAndUpdate(
        { _id: businessClaim.business_post },
        {
          user: business_post_user_id,
          business_name: businessClaim.business_name,
          image:businessClaim.business_post.image,
          cover_image: businessClaim.business_post.cover_image,
          is_delete: businessClaim.business_post.is_delete,
        }
      );
      let member = await businessClaimModel.findOneAndUpdate(
        { _id: id },
        { status: 1 }
      );

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

  reject: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let id = searchParams.get("id");

      let businessClaim = await businessClaimModel
        .findOne({ _id: id })
        .populate([
          { path: "user", model: "User" },
          { path: "business_post", model: "BusinessPost" },
        ]);

      if (businessClaim.user.email !== businessClaim.contact_email) {
        let emailTemplatePath, email_subject;

        emailTemplatePath = path.resolve(
          __dirname,
          "views",
          "mails",
          "claim_mail_reject.ejs"
        );
        email_subject = "Turk's Compass's Claim Reject Mail";

        const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

        const resetLink = "link";

        const mailContent = ejs.render(emailTemplate, {
          resetLink,
        });

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // Set to false for explicit TLS
          auth: {
            user: "turkscompass@gmail.com",
            pass: "cjgwnhbsumbzgsog",
          },
          tls: {
            // Do not fail on invalid certificates
            //rejectUnauthorized: false,
          },
        });

        let mailOptions = {
          from: process.env.EMAIL_USER,
          to: businessClaim.contact_email,
          subject: email_subject,
          html: mailContent,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
      } else {
        let emailTemplatePath, email_subject;
        let userDetails = await userModel.findById(businessClaim.user._id);
        if (userDetails.language == "tr") {
          emailTemplatePath = path.resolve(
            __dirname,
            "views",
            "mails",
            "claim_mail_reject_turkish.ejs"
          );
          email_subject = "Turk’s Compass’a Reddetmek Postası";
        } else {
          emailTemplatePath = path.resolve(
            __dirname,
            "views",
            "mails",
            "claim_mail_reject.ejs"
          );
          email_subject = "Turk's Compass's Claim Mail";
        }

        const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
        const resetLink = "link";
        const mailContent = ejs.render(emailTemplate, {
          resetLink,
        });
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // Set to false for explicit TLS
          auth: {
            user: "turkscompass@gmail.com",
            pass: "cjgwnhbsumbzgsog",
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
      }
      let member = await businessClaimModel.findOneAndUpdate(
        { _id: id },
        { status: 2 }
      );

      res.status(200).send({
        success: true,
        message: "Successfully Rejected",
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
