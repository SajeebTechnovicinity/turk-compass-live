// Import necessary modules
const contactModel = require("../models/contactModel");
const userModel = require("../models/userModel");
const { AuthUser, uploadImageToCloudinary } = require("../utils/helper");
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

// Define contactController methods
const contactController = {
  // Method to create a new contact
  create: async (req, res) => {
    
    try {
      let { name, email, subject, message } = req.body;
      const contactInfo = await contactModel.create({
        name,
        email,
        subject:subject,
        message,
      });

      const user_info = await AuthUser(req);
      const user_id = user_info.id;  

      let emailTemplatePath,email_subject;
      let userDetails = await userModel.findById(user_id);
      if (userDetails.language == "tr") {
        emailTemplatePath = path.resolve(
          __dirname,
          "views",
          "mails",
          "contact_mail_turkish.ejs"
        );
        email_subject = "Turk’s Compass’a  Mailiı";
      } else {
        emailTemplatePath = path.resolve(
          __dirname,
          "views",
          "mails",
          "contact_mail.ejs"
        );
        email_subject = "Turk's Contact Mail";
      }

      const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
      const resetLink = "link";
      const mailContent = ejs.render(emailTemplate, {
        resetLink,
        name: userDetails.userName,
        subject:subject,
        message,
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
        to: email,
        subject: email_subject,
        html: mailContent,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);

      mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'turkscompass@gmail.com',
        subject: email_subject,
        html: mailContent,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);

      res.status(201).send({
        success: true,
        message: "Contact Created Successfully",
        contactInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(403).send({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  },

  // Method to list all categories
  list: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;

      const contacts = await contactModel.find();
      res.status(200).send({
        success: true,
        message: "Contact Retrieved Successfully",
        contacts,
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

// Export contactController
module.exports = contactController;
