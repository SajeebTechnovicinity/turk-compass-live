const jobApplyModel = require("../models/jobApplyModel");
const jobModel = require("../models/jobModel");
const {
  AuthUser,
  uploadImageToCloudinary,
  sendPushNotification,
} = require("../utils/helper");

const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const jobIndustryModel = require("../models/jobIndustryModel");
const nodemailer = require("nodemailer");
const http = require("http");
const { URL } = require("url");
const jobWishListModel = require("../models/jobWishListModel");
const businessPostModel = require("../models/businessPostModel");
const jobProfileModel = require("../models/jobProfileModel");
const { log } = require("console");
const userModel = require("../models/userModel");
const notificationModel = require("../models/notificationModel");

const axios = require("axios");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

// Set storage engine

const jobController = {
  industry: async (req, res) => {
    const { title, icone } = req.body;
    image = await uploadImageToCloudinary(icone);
    const industry = await jobIndustryModel.create({ title: title, image });
    res.status(201).send({
      success: true,
      message: "Successfully",
      industry,
    });
  },

  industryWiseJob: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    let industry = searchParams.get("industry");

    const amount_of_job = await jobModel.countDocuments({
      job_industry: industry,
    });
    res.status(201).send({
      success: true,
      message: "Successfully",
      amount_of_job,
    });
  },
  industryUpdate: async (req, res) => {
    let industry;
    var { title, icone, id } = req.body;
    console.log(req.body);
    if (icone != null && icone != "") {
      icone = await uploadImageToCloudinary(icone);
      console.log(icone);
    } else {
      let industry = await jobIndustryModel.findOne({ _id: id });
      icone = industry.icone;
    }

    industry = await jobIndustryModel.findOneAndUpdate(
      { _id: id },
      { title: title, image: icone }
    );
    res.status(200).send({
      success: true,
      message: "Successfully Updated",
      industry,
    });
  },
  industryGet: async (req, res) => {
    try {
      const industry = await jobIndustryModel
        .find()
        .sort({ title: 1, createdAt: -1 });

      const industryInfo = await Promise.all(
        industry.map(async (iterate) => {
          const amount_of_job = await jobModel.countDocuments({
            job_industry: iterate._id,
          });

          return {
            ...iterate.toObject(),
            amount_of_job: amount_of_job,
          };
        })
      );
      res.status(200).send({
        success: true,
        message: "Successfully",
        industry: industryInfo,
      });
    } catch (error) {
      console.log(error);
    }
  },
  jobDetails: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);

    const user_info = await AuthUser(req);
    const user_id = user_info.id;

    const searchParams = info.searchParams;
    const job_id = searchParams.get("job_id");

    var is_appliy = await jobWishListModel.countDocuments({
      user_id: user_info.id,
      job_id: job_id,
    });

    var is_wishlist = await jobApplyModel.countDocuments({
      apply_by: user_info.id,
      job_id: job_id,
    });

    let jobDetails = await jobModel
      .findOne({ _id: job_id })
      .populate([{ path: "job_industry", model: "JobIndustry" }]);

    res.status(201).send({
      success: true,
      message: "Successfully",
      jobDetails,
      is_appliy,
      is_wishlist,
    });
  },
  jobGet: async (req, res) => {
    // const industry= await jobController.find();
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    const industry_id = searchParams.get("industry_id");
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 12;
    let skip = (page - 1) * limit;
    let query = {};
    if (industry_id) {
      query = { job_industry: new mongoose.Types.ObjectId(industry_id) };
    }
    let job = await jobModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const count = await jobModel.find(query).countDocuments();
    const totalPages = Math.ceil(count / limit);
    res.status(201).send({
      success: true,
      message: "Successfully",
      totalPages,
      currentPage: page,
      job,
    });
  },
  create: async (req, res) => {
    const user_info = await AuthUser(req);
    const user_id = user_info.id;
    const businessInfo = await businessPostModel.findOne({ user: user_id });

    // Uncommented res.status to send the response
    if (businessInfo === null) {
      return res.status(403).send({
        success: false,
        message: "First store your business Account",
      });
    }
    try {
      const {
        job_title,
        job_country,
        job_city,
        job_state,
        salary_type,
        description,
        skill,
        requirement,
        benefit,
        question,
        job_industry,
        job_type,
        candidate_require,
        location,
        salary,
      } = req.body;

      const jobInfo = await jobModel.create({
        business_info: businessInfo._id,
        user_id,
        salary_type,
        job_title,
        job_country,
        job_city,
        job_state,
        description,
        skill,
        requirement,
        benefit,
        question,
        job_industry,
        job_type,
        candidate_require,
        location,
        salary,
      });
      try {
        res.status(201).send({
          success: true,
          message: "Successfully Job Created",
          jobInfo,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "error in jobController api",
          error: error,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in creating memberPerlament",
        error: error.message,
      });
    }
  },
  myJobListyGet: async (req, res) => {
    const user_info = await AuthUser(req);
    const user_id = user_info.id;
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 12;
    let skip = (page - 1) * limit;

    const job = await jobModel

      .find({ user_id: user_id })
      .populate([{ path: "job_industry", model: "JobIndustry" }])
      .populate([
        {
          path: "job_city",
          model: "City",
        },
      ])
      .populate([
        {
          path: "user_id",
          model: "User",
        },
      ])
      .populate([
        {
          path: "job_state",
          model: "State",
        },
      ])
      .populate([
        {
          path: "job_country",
          model: "Country",
        },
      ])
      .populate([
        {
          path: "business_info",
          model: "BusinessPost",
        },
      ])
      .populate([
        {
          path: "job_industry",
          model: "JobIndustry",
        },
      ])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const count = await jobModel.find({ user_id: user_id }).countDocuments();
    const totalPages = Math.ceil(count / limit);
    res.status(201).send({
      success: true,
      message: "Successfully",
      totalPages,
      totalCount: count,
      currentPage: page,
      job,
    });
  },
  jobCandidateListyGet: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let city = searchParams.get("city");
      let state = searchParams.get("state");
      let eligibility = searchParams.get("eligibility");
      let work_visa = searchParams.get("work_visa");
      let job_id = searchParams.get("job_id");
      let page = Number(searchParams.get("page")) || 1;
      let limit = Number(searchParams.get("limit")) || 12;
      let skip = (page - 1) * limit;

      var src_query = {};
      var src_city_query = {};
      if (city) {
        src_city_query = { ...src_query, _id: new mongoose.Types.ObjectId(city) };
      }
      if (state) {
        src_query = { ...src_query, state: new mongoose.Types.ObjectId(state) };
      }
      if (eligibility) {
        src_query = { ...src_query, eligibility: eligibility };
      }
      if (work_visa) {
        src_query = { ...src_query, work_visa: work_visa };
      }

      var candidate_list = await jobApplyModel
        .find({ job_id: job_id })
        .populate([
          {
            path: "job_profile",
            model: "JobProfile",
            match: src_query,
            populate: [
              {
                path: "city",
                model: "City",
                match: src_city_query,
              },
              {
                path: "country",
                model: "Country",
              },
              {
                path: "state",
                model: "State",
              },
            ],
          },
        ])
        .populate([{ path: "apply_by", model: "User" }])
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        if(city ||eligibility ||work_visa){
                candidate_list =  await candidate_list.filter(candidate => 
                candidate.job_profile !== null && 
                candidate.job_profile.city !== null
           );
            
          }

    

      const count = await jobApplyModel
        .find({ job_id: job_id })
        .countDocuments();
      const totalPages = Math.ceil(count / limit);
      res.status(200).send({
        success: true,
        message: "Successfully",
        totalPages,
        currentPage: page,
        candidate_list,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error  api",
        error: error,
      });
    }
  },
  apply: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      const user_id = user_info.id;
      const { job_id, cv, cover_letter, question_ans } = req.body;
      console.log(req.body);
      const base64DataGet = cv; // Get the base64 data from the request body
      let cv_path;

      if (cv !== null) {
        // Upload CV to Cloudinary and get the URL
        cv_path = await uploadImageToCloudinary(cv);
      }

      let profile = await jobProfileModel.findOne({ user_id: user_id });

      var apply_by;
      var job_profile;
      // if (!profile) {
      //   res.status(403).send({
      //     success: false,
      //     message: "First create candidate profile",
      //   });
      // }
      apply_by = user_id;
      job_profile = profile ? profile._id: null;

      let isapply = await jobApplyModel.findOne({
        job_id: job_id,
        apply_by: apply_by,
      });
      if (isapply) {
        res.status(403).send({
          success: false,
          message: "Already applied",
        });
      }
      const store_data = await jobApplyModel.create({
        job_id,
        apply_by,
        cv_path,
        question_ans,
        cover_letter,
        job_profile,
        job_status: 0,
      });

      var job_info = await jobModel.findOne({ _id: job_id });
      var company_id = job_info.user_id;
      var company_info = await userModel.findOne({ _id: company_id });

      jobProfileModel.findOne({ user_id: user_id });

      var package_type = company_info.package_type;
      var company_mail = company_info.email;

      if (company_info && job_info) {
        let title = "New Job Applied";
        let description = job_info.job_title;
        sendPushNotification(title, description, company_info.device_token);
        let job_info_data = jobProfileModel.findOne({ user_id: user_id });
        let candidate_info_data = await userModel.findOne({ _id: user_id });
        // await notificationModel.create({user:company_id,title:title,description:description,image:job_info_data.photo});
        await notificationModel.create({
          user: company_id,
          title: title,
          description: description,
          image: candidate_info_data.photo,
        });
      }

      // mail
      const emailTemplatePath = path.resolve(
        __dirname,
        "views",
        "mails",
        "job_apply_mail.ejs"
      );
      const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
      const mailContent = ejs.render(emailTemplate, {
        date: new Date(),
        cover_letter: cover_letter,
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
      const mailOptions = {
        from: process.env.EMAIL_USER, // Make sure this environment variable is set
        to: company_mail, // Ensure company_mail is a valid email address
        //to: 'sajeebchakraborty.cse2000@gmail.com',
        subject: "New Job Applied",
        html: mailContent, // Ensure mailContent contains the proper HTML content
        attachments: [
          {
            filename: "cv.pdf", // The name of the attachment file
            path: cv_path, // The URL to the PDF file
          },
        ],
      };
      if(package_type=="general_employer"){
          await transporter.sendMail(mailOptions);
        }
     

      // mail
      res.status(200).send({
        success: true,
        message: "Successfully",
        store_data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: error.message,
        error: error,
      });
    }
    // jobApplyModel.create({job_id,cv,cover_letter})
  },

  // apply: async (req, res) => {
  //     try {
  //         const user_info = await AuthUser(req);
  //         const user_id = user_info.id;
  //         const { job_id, cv, cover_letter, question_ans } = req.body;
  //         const base64DataGet = cv; // Get the base64 data from the request body
  //         let cv_path;
  //         if (cv != null) {
  //             cv_path = await uploadImageToCloudinary(base64DataGet);
  //         }

  //         let profile = await jobProfileModel.findOne({ user_id: user_id });

  //         var apply_by;
  //         var job_profile;
  //         if (!profile) {
  //             return res.status(403).send({
  //                 success: false,
  //                 message: "First create candidate profile",
  //             });
  //         }
  //         apply_by = user_id;
  //         job_profile = profile._id;

  //         let isapply = await jobApplyModel.findOne({
  //             job_id: job_id,
  //             apply_by: apply_by,
  //         });
  //         if (isapply) {
  //             return res.status(403).send({
  //                 success: false,
  //                 message: "Already applied",
  //             });
  //         }
  //         const store_data = await jobApplyModel.create({
  //             job_id,
  //             apply_by,
  //             cv_path,
  //             question_ans,
  //             cover_letter,
  //             job_profile,
  //             job_status: 0,
  //         });

  //         var job_info = await jobModel.findOne({ _id: job_id });
  //         var company_id = job_info.user_id;
  //         var company_info = await userModel.findOne({ _id: company_id });

  //         var package_type = company_info.package_type;
  //         var company_mail = company_info.email;

  //         if (company_info && job_info) {
  //             let title = "New Job Applied";
  //             let description = job_info.job_title;
  //             sendPushNotification(title, description, company_info.device_token);
  //             let candidate_info_data = await userModel.findOne({ _id: user_id });
  //             await notificationModel.create({ user: company_id, title: title, description: description, image: candidate_info_data.photo });
  //         }

  //         // Download the CV from Cloudinary
  //         const response = await axios.get(cv_path, { responseType: 'arraybuffer' });
  //         const localCvPath = path.resolve(__dirname, 'cv.pdf');
  //         await writeFile(localCvPath, response.data);

  //         // Send email
  //         const emailTemplatePath = path.resolve(__dirname, "views", "mails", "job_apply_mail.ejs");
  //         const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  //         const mailContent = ejs.render(emailTemplate, { date: new Date(), cover_letter: cover_letter });

  //         const transporter = nodemailer.createTransport({
  //             host: 'smtp.gmail.com',
  //             port: 465,
  //             secure: true,
  //             auth: {
  //                 user: 'technovicinity.dev@gmail.com',
  //                 pass: 'wsvrvojuwyraazog',
  //             },
  //             tls: {
  //                 rejectUnauthorized: false,
  //             },
  //         });

  //         const mailOptions = {
  //             from: process.env.EMAIL_USER,
  //             //to: company_mail,
  //             to:'sajeebchakraborty.cse2000@gmail.com',
  //             subject: "New Job Applied",
  //             html: mailContent,
  //             attachments: [
  //                 {
  //                     filename: 'cv.pdf',
  //                     path: localCvPath,
  //                 }
  //             ],
  //         };
  //         if(package_type=="general_employer"){
  //             await transporter.sendMail(mailOptions);
  //         }
  //         res.status(200).send({
  //             success: true,
  //             message: "Successfully",
  //             store_data,
  //         });
  //     } catch (error) {
  //         console.log(error);
  //         res.status(403).send({
  //             success: false,
  //             message: error.message,
  //             error: error,
  //         });
  //     }
  // },

  getApplyInfo: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    let apply_id = searchParams.get("apply_id");
    try {
      let apply_info = await jobApplyModel
        .findOne({
          _id: apply_id,
        })
        .populate([
          {
            path: "apply_by",
            model: "User",
          },
          {
            path: "job_id",
            model: "Job",
          },
        ]);
      res.status(200).send({
        success: true,
        message: " Successfully",
        apply_info,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error  api",
        error: error,
      });
    }
    // jobApplyModel.create({job_id,cv,cover_letter})
  },
  myApplyList: async (req, res) => {
    const user_info = await AuthUser(req);
    const user_id = user_info.id;
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 12;
    let job_title = searchParams.get("job_title") || null;
    let job_type = searchParams.get("job_type") || null;
    let job_city = searchParams.get("job_city") || null;
    let skip = (page - 1) * limit;
    var searchArray = [];
    if (job_title) {
      const searchRegex = new RegExp(job_title, "i"); // it will be search like
      searchArray.push({
        $match: {
          job_title: { $regex: searchRegex }, // Perform a regex search for job_title
        },
      });
    }
    if (job_type) {
      searchArray.push({ $match: { job_type: job_type } });
    }
    if (job_city) {
      searchArray.push({
        $match: { job_city: new mongoose.Types.ObjectId(job_city) },
      });
    }

    // res.status(200).send({
    //     searchArray
    // });
    const job = await jobModel
      .aggregate([
        ...searchArray, // Spread searchArray into the pipeline stages
        {
          $lookup: {
            from: "jobindustries",
            localField: "job_industry", // the field from the Job collection
            foreignField: "_id", // the field from the JobIndustries collection
            as: "job_industry_info", // the name of the field to store the joined data
          },
        },
        {
          $lookup: {
            from: "businessposts",
            localField: "business_info",
            foreignField: "_id",
            as: "company_info",
          },
        },
        {
          $lookup: {
            from: "jobapplies", // the collection name to join with
            let: { jobId: "$_id" }, // variables to use in the pipeline
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$job_id", "$$jobId"] },
                      {
                        $eq: [
                          "$apply_by",
                          new mongoose.Types.ObjectId(user_id),
                        ],
                      },
                      { $eq: ["$status", 1] },
                    ],
                  },
                },
              },
            ],
            as: "applications",
          },
        },
        {
          $match: {
            $expr: {
              $ne: [{ $size: "$applications" }, 0], // Check if applications array is not empty
            },
            "applications.apply_by": new mongoose.Types.ObjectId(user_id),
          },
        },
        {
          $lookup: {
            from: "jobwishlists", // the collection name to join with
            let: { jobId: "$_id" }, // variables to use in the pipeline
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$job_id", "$$jobId"] },
                      {
                        $eq: ["$user_id", new mongoose.Types.ObjectId(user_id)],
                      },
                      { $eq: ["$status", 1] },
                    ],
                  },
                },
              },
            ],
            as: "jobwishlist",
          },
        },
        {
          $addFields: {
            is_applied: {
              $cond: {
                if: { $gt: [{ $size: "$applications" }, 0] },
                then: true,
                else: false,
              },
            }, // check if applications array has any elements
            is_wishlist: {
              $cond: {
                if: { $gt: [{ $size: "$jobwishlist" }, 0] },
                then: true,
                else: false,
              },
            }, // check if applications array has any elements
          },
        },
      ])
      .skip(skip)
      .limit(limit);

    const count = await jobModel.find({ user_id: user_id }).countDocuments();
    const totalPages = Math.ceil(count / limit);

    res.status(200).send({
      success: true,
      message: "Successfully",
      totalPages,
      currentPage: page,
      job,
      totalCount: count,
      user_id,
    });
  },
  addShortList: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    const job_id = searchParams.get("job_id");
    const apply_by = searchParams.get("apply_by");

    var jobinfo = await jobApplyModel.findOne({
      job_id: job_id,
      apply_by: apply_by,
    });

    var updateInfo = [];
    if (jobinfo) {
      updateInfo = await jobApplyModel.findOneAndUpdate(
        {
          job_id: job_id,
          apply_by: apply_by,
        },
        {
          job_status: !jobinfo.job_status,
        }
      );
    }
    res.status(200).send({
      success: true,
      message: " Successfully",
      updateInfo,
    });
  },
  myJobShortList: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    const job_id = searchParams.get("job_id");
    var candidate_list = await jobApplyModel
      .find({
        job_id: job_id,
        job_status: 1,
      })
      .populate([{ path: "apply_by", model: "User" }])
      .populate({
        path: "job_profile",
        model: "JobProfile",
      })
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: " Successfully",
      candidate_list,
    });
  },
  allJobListGet: async (req, res) => {
    const user_info = await AuthUser(req);
    const user_id = user_info ? user_info.id : null;
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 12;
    let job_title = searchParams.get("job_title") || null;
    let job_type = searchParams.get("job_type") || null;
    let job_city = searchParams.get("job_city") || null;
    let job_industry = searchParams.get("job_industry") || null;
    let skip = (page - 1) * limit;

    var searchArray = [];
    if (job_title) {
      const searchRegex = new RegExp(job_title, "i"); // it will be search like
      searchArray.push({
        $match: {
          job_title: { $regex: searchRegex }, // Perform a regex search for job_title
        },
      });
    }
    if (job_type) {
      searchArray.push({ $match: { job_type: job_type } });
    }
    if (job_city) {
      searchArray.push({
        $match: { job_city: new mongoose.Types.ObjectId(job_city) },
      });
    }
    if (job_industry) {
      searchArray.push({
        $match: { job_industry: new mongoose.Types.ObjectId(job_industry) },
      });
    }

    // res.status(200).send({
    //     searchArray
    // });

    // pre
    // const job = await jobModel
    //     .aggregate([
    //         ...searchArray, // Spread searchArray into the pipeline stages
    //         {
    //             $lookup: {
    //                 from: "jobindustries",
    //                 localField: "job_industry",
    //                 foreignField: "_id",
    //                 as: "job_industry_info",
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "businessposts",
    //                 localField: "business_info",
    //                 foreignField: "_id",
    //                 as: "company_info",
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "cities",
    //                 localField: "job_city",
    //                 foreignField: "_id",
    //                 as: "city_info",
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "states",
    //                 localField: "job_state",
    //                 foreignField: "_id",
    //                 as: "state_info",
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "users",
    //                 localField:"user_id",
    //                 foreignField:"_id",
    //                 as: "owner_info",
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "jobapplies", // the collection name to join with
    //                 let: { jobId: "$_id" }, // variables to use in the pipeline
    //                 pipeline: [
    //                     {
    //                         $match: {
    //                             $expr: {
    //                                 $and: [
    //                                     { $eq: ["$job_id", "$$jobId"] },
    //                                     {
    //                                         $eq: [
    //                                             "$apply_by",
    //                                             new mongoose.Types.ObjectId(user_id),
    //                                         ],
    //                                     },
    //                                     { $eq: ["$status", 1] },
    //                                 ],
    //                             },
    //                         },
    //                     },
    //                 ],
    //                 as: "applications",
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "jobwishlists", // the collection name to join with
    //                 let: { jobId: "$_id" }, // variables to use in the pipeline
    //                 pipeline: [
    //                     {
    //                         $match: {
    //                             $expr: {
    //                                 $and: [
    //                                     { $eq: ["$job_id", "$$jobId"] },
    //                                     {
    //                                         $eq: ["$user_id", new mongoose.Types.ObjectId(user_id)],
    //                                     },
    //                                     { $eq: ["$status", 1] },
    //                                 ],
    //                             },
    //                         },
    //                     },
    //                 ],
    //                 as: "jobwishlist",
    //             },
    //         },
    //         {
    //             $addFields: {
    //                 is_applied: {
    //                     $cond: {
    //                         if: { $gt: [{ $size: "$applications" }, 0] },
    //                         then: true,
    //                         else: false,
    //                     },
    //                 }, // check if applications array has any elements
    //                 is_wishlist: {
    //                     $cond: {
    //                         if: { $gt: [{ $size: "$jobwishlist" }, 0] },
    //                         then: true,
    //                         else: false,
    //                     },
    //                 }, // check if applications array has any elements
    //             },
    //         },

    //     ])
    //     .skip(skip)
    //     .limit(limit).sort({ createdAt: -1 });;

    const currentDate = new Date();
    const thirtyDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - 30)
    );

    const job = await jobModel.aggregate([
      ...searchArray, // Spread searchArray into the pipeline stages
      {
        $lookup: {
          from: "jobindustries",
          localField: "job_industry",
          foreignField: "_id",
          as: "job_industry_info",
        },
      },
      {
        $lookup: {
          from: "businessposts",
          localField: "business_info",
          foreignField: "_id",
          as: "company_info",
        },
      },
      {
        $addFields: {
          company_info: {
            $filter: {
              input: "$company_info",
              as: "company",
              cond: { $eq: ["$$company.is_delete", false] },
            },
          },
        },
      },
      {
        $match: {
          company_info: { $ne: [] }, // Filter out documents where company_info is an empty array
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "job_city",
          foreignField: "_id",
          as: "city_info",
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "job_state",
          foreignField: "_id",
          as: "state_info",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "owner_info",
        },
      },
      {
        $addFields: {
          owner_info: { $arrayElemAt: ["$owner_info", 0] }, // Get the first element of the owner_info array
        },
      },
      {
        $lookup: {
          from: "jobapplies",
          let: { jobId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$job_id", "$$jobId"] },
                    {
                      $eq: ["$apply_by", new mongoose.Types.ObjectId(user_id)],
                    },
                    { $eq: ["$status", 1] },
                  ],
                },
              },
            },
          ],
          as: "applications",
        },
      },
      {
        $lookup: {
          from: "jobwishlists",
          let: { jobId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$job_id", "$$jobId"] },
                    { $eq: ["$user_id", new mongoose.Types.ObjectId(user_id)] },
                    { $eq: ["$status", 1] },
                  ],
                },
              },
            },
          ],
          as: "jobwishlist",
        },
      },
      {
        $addFields: {
          is_applied: {
            $cond: {
              if: { $gt: [{ $size: "$applications" }, 0] },
              then: true,
              else: false,
            },
          },
          is_wishlist: {
            $cond: {
              if: { $gt: [{ $size: "$jobwishlist" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $match: {
          "owner_info.is_delete": false, // Filter documents where owner_info.is_delete is false
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const allJob = await jobModel.aggregate([
      ...searchArray, // Spread searchArray into the pipeline stages
      {
        $lookup: {
          from: "jobindustries",
          localField: "job_industry",
          foreignField: "_id",
          as: "job_industry_info",
        },
      },
      {
        $lookup: {
          from: "businessposts",
          localField: "business_info",
          foreignField: "_id",
          as: "company_info",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "job_city",
          foreignField: "_id",
          as: "city_info",
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "job_state",
          foreignField: "_id",
          as: "state_info",
        },
      },
      {
        $lookup: {
          from: "jobapplies", // the collection name to join with
          let: { jobId: "$_id" }, // variables to use in the pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$job_id", "$$jobId"] },
                    {
                      $eq: ["$apply_by", new mongoose.Types.ObjectId(user_id)],
                    },
                    { $eq: ["$status", 1] },
                  ],
                },
              },
            },
          ],
          as: "applications",
        },
      },
      {
        $lookup: {
          from: "jobwishlists", // the collection name to join with
          let: { jobId: "$_id" }, // variables to use in the pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$job_id", "$$jobId"] },
                    {
                      $eq: ["$user_id", new mongoose.Types.ObjectId(user_id)],
                    },
                    { $eq: ["$status", 1] },
                  ],
                },
              },
            },
          ],
          as: "jobwishlist",
        },
      },
      {
        $addFields: {
          is_applied: {
            $cond: {
              if: { $gt: [{ $size: "$applications" }, 0] },
              then: true,
              else: false,
            },
          }, // check if applications array has any elements
          is_wishlist: {
            $cond: {
              if: { $gt: [{ $size: "$jobwishlist" }, 0] },
              then: true,
              else: false,
            },
          }, // check if applications array has any elements
        },
      },
    ]);

    // const count = await jobModel.find({ user_id: user_id }).countDocuments();
    const count = allJob.length;
    const totalPages = Math.ceil(count / limit);

    res.status(200).send({
      success: true,
      message: "Successfully",
      totalPages,
      totalCount: count,
      currentPage: page,
      job,
      user_id,
    });
  },
  jobwishListAddDelete: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      const user_id = user_info.id;
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      const job_id = searchParams.get("job_id");

      var is_wishlist = await jobWishListModel.findOne({
        job_id: job_id,
        user_id: user_id,
      });
      var message = "";
      if (is_wishlist) {
        is_wishlist = await jobWishListModel.deleteOne({
          job_id: job_id,
          user_id: user_id,
        });
        message = "Successfully Deleted from Wishlist";
      } else {
        message = "Successfully Added in Wishlist";
        is_wishlist = await jobWishListModel.create({
          job_id: job_id,
          user_id: user_id,
        });
      }

      res.status(200).send({
        success: true,
        message: message,
        is_wishlist: is_wishlist,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error job wishlist add delete api",
        error: error,
      });
    }
  },
  myJobwishList: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      const user_id = user_info.id;
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      var wishlist = await jobWishListModel
        .find({ user_id: user_id })
        .populate([
          {
            path: "job_id",
            model: "Job",
            populate: [
              {
                path: "job_industry", // assuming 'job_industry' is a reference field inside the 'Job' model
                model: "JobIndustry", // the model to populate
              },
              {
                path: "business_info",
                model: "BusinessPost",
              },
              {
                path: "user_id",
                model: "User",
              },
            ],
          },
        ]);

      wishlist = await wishlist.filter(
        (item) => item.job_id.user_id.is_delete == 0
      );

      const myApplyList = await jobApplyModel
        .find({ apply_by: user_id })
        .select("job_id");
      const myWishList = await jobWishListModel
        .find({ user_id: user_id })
        .select("job_id");

      res.status(200).send({
        success: true,
        message: "Wish List",
        wishlist,
        myApplyList,
        myWishList,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "job wishlist add delete api",
        error: error,
      });
    }
  },

  edit: async (req, res) => {
    const user_info = await AuthUser(req);
    const user_id = user_info.id;
    const businessInfo = await businessPostModel.findOne({ user: user_id });

    // Uncommented res.status to send the response
    if (businessInfo === null) {
      return res.status(403).send({
        success: false,
        message: "First store your business Account",
      });
    }
    try {
      const {
        job_title,
        job_country,
        job_city,
        job_state,
        salary_type,
        description,
        skill,
        id,
        requirement,
        benefit,
        question,
        job_industry,
        job_type,
        candidate_require,
        location,
        salary,
      } = req.body;

      const jobInfo = await jobModel.updateOne({_id:id},{
        business_info: businessInfo._id,
        user_id,
        salary_type,
        job_title,
        job_country,
        job_city,
        job_state,
        description,
        skill,
        requirement,
        benefit,
        question,
        job_industry,
        job_type,
        candidate_require,
        location,
        salary,
      });
      try {
        res.status(201).send({
          success: true,
          message: "Successfully Job Updated",
          jobInfo,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "error in jobController api",
          error: error,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in creating memberPerlament",
        error: error.message,
      });
    }
  },
};

module.exports = { jobController };
