const jobApplyModel = require("../models/jobApplyModel");
const jobModel = require("../models/jobModel");
const { AuthUser, uploadImageToCloudinary } = require("../utils/helper");

const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jobIndustryModel = require("../models/jobIndustryModel");
const http = require('http');
const { URL } = require('url');



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
    industryGet: async (req, res) => {
        const industry = await jobIndustryModel.find();
        res.status(201).send({
            success: true,
            message: "Successfully",
            industry,
        });
        
    },
    jobDetails: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        const job_id = searchParams.get('job_id');
        let jobDetails = await jobModel.findOne({ _id: job_id }).populate([
            { path: "job_industry", model: "JobIndustry" }]);
        res.status(201).send({
            success: true,
            message: "Successfully",
            jobDetails,
        });
    },

    jobGet: async (req, res) => {
        // const industry= await jobController.find();
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        const industry_id = searchParams.get('industry_id');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
        let query = {}
        if (industry_id) {
            query = { "job_industry": industry_id }
        }

        let job = await jobModel.find(query).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const count = await jobModel.find(query).countDocuments();
        const totalPages = Math.ceil(count / limit);
        res.status(201).send({
            success: true,
            message: "Successfully",
            totalPages,
            currentPage: page,
            job
        });
    },
    create: async (req, res) => {
        const {
            job_title,
            job_country,
            job_city,
            job_state,
            salary_type,
            description,
            skill,
            requirement,
            benifit,
            question,
            job_industry,
            job_type,
            candidate_require,
            location,
            salary } = req.body;

        const user_info = await AuthUser(req);
        const user_id = user_info.id;

        const jobInfo = await jobModel.create({
            user_id,
            salary_type,
            job_title,
            job_country,
            job_city,
            job_state,
            description,
            skill,
            requirement,
            benifit,
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
                message: "Login Successfully",
                jobInfo
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: false,
                message: 'error in jobController api',
                error: error
            })
        }
    },
    myJobListyGet: async (req, res) => {
        const user_info = await AuthUser(req);
        const user_id = user_info.id;
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;

        const job = await jobModel.find({ user_id: user_id }).populate([
            { path: "job_industry", model: "JobIndustry" }])
            .skip(skip)
            .limit(limit);

            const count = await jobModel.find({ user_id: user_id }).countDocuments();
            const totalPages = Math.ceil(count / limit);


        res.status(201).send({
            success: true,
            message: "Successfully",
            totalPages,
            currentPage: page,
            job
        });
    },
     jobCandidateListyGet: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let job_id = searchParams.get('job_id');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;

        const candidate_list = await jobApplyModel.find({ job_id: job_id }).populate([
            { path: "apply_by",model:"User"}])
            .skip(skip)
            .limit(limit);

            const count = await jobApplyModel.find({ job_id: job_id }).countDocuments();
            const totalPages = Math.ceil(count / limit);
        res.status(200).send({
            success: true,
            message: "Successfully",
            totalPages,
            currentPage: page,
            candidate_list
        });
    },
    apply: async (req, res) => {
        const user_info = await AuthUser(req);
        const apply_by = user_info.id;
        const { job_id, cv, cover_letter } = req.body;
        const base64DataGet = cv; // Get the base64 data from the request body
        const cv_path = await uploadImageToCloudinary(base64DataGet);
        let isapply=await jobApplyModel.findOne({job_id:job_id,apply_by:apply_by});
        if(isapply){
            res.status(403).send({
                success: false,
                message: "Already applied",
            });
        }

        const store_data = await jobApplyModel.create({ job_id, apply_by, cv_path, cover_letter, })
        res.status(200).send({
            success: true,
            message: " Successfully",
            store_data
        });
        // jobApplyModel.create({job_id,cv,cover_letter})
    },

    addShortList: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        const job_id = searchParams.get("job_id");
        const apply_by = searchParams.get("apply_by");
        var updateInfo = await jobApplyModel.findOneAndUpdate(
            {
                "job_id": job_id,
                "apply_by": apply_by
            },
            {
                "job_status": 1
            }
        )
        res.status(200).send({
            success: true,
            message: " Successfully",
            updateInfo
        });
    },
    myJobShortList: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        const job_id = searchParams.get("job_id");
        var candidate_list = await jobApplyModel.find(
            {
                "job_id": job_id,
            },
        ).populate([
            { path: "apply_by", model: "User" }]);
        res.status(200).send({
            success: true,
            message: " Successfully",
            candidate_list
        });

    },

    allJobListGet: async (req, res) => {
        const user_info = await AuthUser(req);
        const user_id = user_info.id;
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let job_title = searchParams.get('job_title') || null;
        let job_type = searchParams.get('job_type') || null;
        let job_city = searchParams.get('job_city') || null;
        let skip = (page - 1) * limit;

    
    
        var searchArray = [];
        if (job_title) {
            const searchRegex = new RegExp(job_title, 'i');  // it will be search like 
            searchArray.push({    $match: {
                job_title: { $regex: searchRegex } // Perform a regex search for job_title
            } });
        }
        if (job_type) {
            searchArray.push({ $match:{job_type: job_type}});
        }
        if (job_city) {
            searchArray.push({
                $match: { job_city: new mongoose.Types.ObjectId(job_city) }
            });
        }

        // res.status(200).send({
        //     searchArray
        // });
    
        const job = await jobModel.aggregate([
            ...searchArray, // Spread searchArray into the pipeline stages
            {
                $lookup: {
                    from: 'jobindustries',
                    localField: 'job_industry', // the field from the Job collection
                    foreignField: '_id', // the field from the JobIndustries collection
                    as: 'job_industry_info' // the name of the field to store the joined data
                }
            },
            {
                $lookup: {
                    from: 'jobapplies', // the collection name to join with
                    let: { jobId: '$_id' }, // variables to use in the pipeline
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$job_id', '$$jobId'] },
                                        { $eq: ['$apply_by', new mongoose.Types.ObjectId('6638a2e7c35d9d33e94211ad')] },
                                        { $eq: ['$status', 1] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'applications'
                },
            },
            {
                $addFields: {
                    is_applied: { $cond: { if: { $gt: [{ $size: '$applications' }, 0] }, then: true, else: false } } // check if applications array has any elements
                }
            }
        ]).skip(skip)
          .limit(limit);
    
        const count = await jobModel.find({ user_id: user_id }).countDocuments();
        const totalPages = Math.ceil(count / limit);
    
        res.status(200).send({
            success: true,
            message: "Successfully",
            totalPages,
            currentPage: page,
            job
        });
    },

}

module.exports = { jobController }