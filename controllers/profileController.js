// Import necessary modules
const userModel = require("../models/userModel");
const bcrypt= require('bcrypt');
const { uploadImageToCloudinary } = require("../utils/helper");
const { AuthUser } = require("../utils/helper");
const durationSlotModel = require("../models/durationSlotModel");
const businessPostModel = require("../models/businessPostModel");
const jobProfileModel = require("../models/jobProfileModel");

// Define profile Controller methods
const profileController = {

    list: async (req, res) => {
        try {
            const user_info= await AuthUser(req);
            user_id=user_info.id;

            const profile = await userModel.findById(user_id);
    
            res.status(200).send({
                success: true,
                message: "User Profile Retrieved Successfully",
                profile
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching categories',
                error: error.message
            });
        }
    },
    businessProfilelist: async (req, res) => {
        try {
            const user_info= await AuthUser(req);
            user_id=user_info.id;

            const businessProfile=await businessPostModel.findOne({user:user_id});
    
            res.status(200).send({
                success: true,
                message: "User Profile Retrieved Successfully",
                businessProfile
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching categories',
                error: error.message
            });
        }
    },
    update: async (req, res) => {
        try {
            const user_info= await AuthUser(req);
            user_id=user_info.id;
            const { duration,is_reservation_available,is_multiple_reservation_available } = req.body;
            const profile = await userModel.findOneAndUpdate({_id:user_id},{slot_duration:duration,is_reservation_available,is_multiple_reservation_available});
            const business_post_Update = await businessPostModel.findOneAndUpdate({user:user_id},{is_reservation_available,is_multiple_reservation_available});
            const startTime = new Date().setHours(0, 0, 0, 0); // Start from midnight
            const endTime = new Date().setHours(23, 59, 59, 999); // End at 11:59:59 PM
            
            const slots = [];
            let currentTime = startTime;

            // let business_post_details=await businessPostModel.findOne({user:user_id});
            // let business_post=business_post_details._id;
            // console.log(business_post_details._id);

            let alreadySlotCreated=await durationSlotModel.countDocuments({ duration: duration, is_delete: 0 });

            if(alreadySlotCreated>0){
                return res.status(200).send({
                    success: true,
                    message: "User Profile Retrieved Successfully",
                    profile
                });
            }
            
            // Iterate through the day and create slots based on the provided duration
            while (currentTime < endTime) {
                const slotStartTime = new Date(currentTime);
                const slotEndTime = new Date(currentTime + duration * 60000); // Convert minutes to milliseconds
    
                // Format the slot start and end times
                const formattedSlotStartTime = slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const formattedSlotEndTime = slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
                // Push the slot information into the array
                slots.push({
                    startTime: formattedSlotStartTime,
                    endTime: formattedSlotEndTime
                });

                

                await durationSlotModel.create({
                    start_time: formattedSlotStartTime,
                    end_time: formattedSlotEndTime,
                    duration:duration,
                });
                // Move to the next slot
                currentTime = slotEndTime.getTime();
            }


            res.status(200).send({
                success: true,
                message: "User Profile Retrieved Successfully",
                profile
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching categories',
                error: error.message
            });
        }
    },
    jobProfileCreateUpdate:async (req, res) =>{
        var { 
            summary,
            work_history,
            education,
            skill,
            language,
            eligibility,
            defalut_cv,
          } = req.body;

          const user_info= await AuthUser(req);
          var user_id=user_info.id;
          if(defalut_cv){
            defalut_cv = await uploadImageToCloudinary(base64DataGet);
          }
         var profile_info;
         let is_created=await jobProfileModel.findOne({user_id:user_id});
         if(is_created){
            var query={};
            if(summary){
                query={summary:summary}
            }
            if(work_history){
                query={work_history:work_history}
            }
            if(education){
                query={education:education}
            }
            if(skill){
                query={skill:skill}
            }
            if(language){
                query={language:language}
            }
            if(eligibility){
                query={eligibility:eligibility}
            }
            if(defalut_cv){
                query={defalut_cv:defalut_cv}
            }

            profile_info=await jobProfileModel.findOneAndUpdate({user_id:user_id},query)

         }else{
            profile_info=await jobProfileModel.create({ 
                user_id,
                summary,
                work_history,
                education,
                skill,
                language,
                eligibility,
                defalut_cv,
              })
         }
        
         res.status(200).send({
            success: true,
            message: "Successfully updated",
            profile_info
        });

    },
    jobProfileGet:async (req, res) =>{
        const user_info= await AuthUser(req);
        user_id=user_info.id;
       var profile_info=await jobProfileModel.findOne({user_id:user_id})

        res.status(200).send({
            success: true,
            message:"Successfully",
            profile_info
        });
    }

};

// Export profileController
module.exports = profileController;
