const jobApplyModel = require("../models/jobApplyModel");
const jobModel = require("../models/jobModel");
const { AuthUser, uploadImageToCloudinary } = require("../utils/helper");


const multer = require('multer');
const fs = require('fs');
const path = require('path');


// Set storage engine

const jobController={
    create:async(req,res)=>{
        const {description,skill,requirement,benifit,question}=req.body;
        const user_info= await AuthUser(req);
        const user_id=user_info.id;
        const jobInfo= await jobModel.create({user_id,description,skill,requirement,benifit,question});

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