const moment = require('moment');
const { AuthUser } = require('../utils/helper');
const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel');
const faqModel = require('../models/faqModel');
const settingModel = require('../models/settingModel');
const appInfoModel = require('../models/appInfoModel');

const appInfoController={
    abountTermsPrivacy:async(req, res) => {
        const {about_us,terms_condition,privacy_policy}=req.body;
        let appinfo=appInfoModel.findOne();
        if(appinfo){
            appInfoModel.updateOne({
                "about_us":about_us,
                "terms_condition":terms_condition,
                "privacy_policy":privacy_policy,
            })
        }
        else{
            appinfo = await appInfoModel.create({
                "about_us":about_us,
                "terms_condition":terms_condition,
                "privacy_policy":privacy_policy,
            })

        }
        res.status(200).send({
            success:true,
            message:'successfully password updated',
            appinfo,
         })
    },

    abountTermsPrivacyGet:async(req, res) => {
        let appinfo= await appInfoModel.findOne();
        res.status(200).send({
            success:true,
            message:'successfully password updated',
            appinfo,
         })
    }
}
module.exports={appInfoController}