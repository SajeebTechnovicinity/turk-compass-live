const jobApplyModel = require("../models/jobApplyModel");
const jobModel = require("../models/jobModel");
const { AuthUser, uploadImageToCloudinary } = require("../utils/helper");


const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jobIndustryModel = require("../models/jobIndustryModel");
const http = require('http');
const { URL } = require('url');



// Set storage engine


const jobController={
    industry:async(req,res)=>{
        const {title,icone}=req.body;
        image = await uploadImageToCloudinary(icone);
      const industry= await jobIndustryModel.create({title:title,image});
        res.status(201).send({
            success:true,
            message:"Successfully",
            industry,
        });
    },
    industryGet:async(req,res)=>{
        
      const industry= await jobIndustryModel.find();
        res.status(201).send({
            success:true,
            message:"Successfully",
            industry,
        });
    },
    jobDetails:async(req,res)=>{
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        const job_id = searchParams.get('job_id');
        let jobDetails = await jobModel.findOne({_id:job_id}).populate([
            { path: "job_industry", model: "JobIndustry" }]);
        res.status(201).send({
            success:true,
            message:"Successfully",
            jobDetails,
        });

    } ,

    jobGet:async(req,res)=>{
        // const industry= await jobController.find();
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        const industry_id = searchParams.get('industry_id');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
        let query={}
        if(industry_id){
            query ={"job_industry":industry_id}
        }

        let job= await jobModel.find(query).sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const count = await jobModel.find(query).countDocuments(); 
        const totalPages = Math.ceil(count / limit);
        res.status(201).send({
            success:true,
            message:"Successfully",
            totalPages,
            currentPage: page,
            job
        });
    },
    create:async(req,res)=>{
        const {
            description,
            skill,
            requirement,
            benifit,
            question,
            job_industry,
            job_type,
            candidate_require,
            location,
            salary}=req.body;

        const user_info= await AuthUser(req);
        const user_id=user_info.id;

        const jobInfo= await jobModel.create({
            user_id,
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

        try{
        res.status(201).send({
            success:true,
            message:"Login Successfully",
            jobInfo
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
           success:false,
           message:'error in jobController api',
           error:error
        })
    }
    },
    apply:async(req,res)=>{
        const user_info= await AuthUser(req);
        const apply_by=user_info.id;
        const {job_id,cv,cover_letter}=req.body;
        const base64DataGet = cv; // Get the base64 data from the request body
        const cv_path = await uploadImageToCloudinary(base64DataGet);

        const store_data=await jobApplyModel.create({job_id,apply_by,cv_path,cover_letter,})
        res.status(201).send({
            success:true,
            message:" Successfully",
            store_data
        });
         
 
        // jobApplyModel.create({job_id,cv,cover_letter})
    }

}

module.exports={jobController}