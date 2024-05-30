const moment = require('moment');
const { AuthUser, isBase64Image, uploadImageToCloudinary } = require('../utils/helper');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const faqModel = require('../models/faqModel');
const settingModel = require('../models/settingModel');
const appInfoModel = require('../models/appInfoModel');

const appInfoController = {
    abountTermsPrivacy: async (req, res) => {
        try{
            const { about_us, terms_condition, privacy_policy,home_banner} = req.body;
            let appinfo = await appInfoModel.findOne();
            var query = {};
            if (about_us && terms_condition && privacy_policy) {
                query = {
                    about_us: about_us,
                    terms_condition: terms_condition,
                    privacy_policy: privacy_policy
                };
            }
            if (home_banner) {
                // let isBase64=isBase64Image(home_banner.image);
                // if(isBase64){
                //     const imgurl = await uploadImageToCloudinary(home_banner.image);
                //     home_banner={...home_banner,image:imgurl}
                // }
                // console.log(home_banner)
                query = {
                    "home_banner": home_banner,
                };
            }
    
            if (appinfo) {
                await appInfoModel.updateOne({},query);
                appinfo = await appInfoModel.findOne(); // Refresh appinfo after update
            } else {
                appinfo = await appInfoModel.create(query);
            }
    
            res.status(200).send({
                success: true,
                message: 'Successfully updated app information',
                appinfo
            });
        }catch(error){
            console.log(error)
            res.status(500).send({
               success:false,
               message:'error in login api dfgh',
               error:error
            })
        }
    },

    abountTermsPrivacyGet: async (req, res) => {
        let appinfo = await appInfoModel.findOne();
        res.status(200).send({
            success: true,
            message: 'successfully password updated',
            appinfo,
        })
    }
}
module.exports = { appInfoController }