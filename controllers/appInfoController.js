const moment = require('moment');
const { AuthUser } = require('../utils/helper');
const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel');
const faqModel = require('../models/faqModel');
const settingModel = require('../models/settingModel');
const appInfoModel = require('../models/appInfoModel');

const appInfoController={
    abountTermsPrivacy:async(req, res) => {
        const { about_us, terms_condition, privacy_policy } = req.body;
        console.log(req.body);
        
        let appinfo = await appInfoModel.findOne();
        
        if (appinfo) {
            await appInfoModel.updateOne({}, {
                about_us: about_us,
                terms_condition: terms_condition,
                privacy_policy: privacy_policy
            });
            appinfo = await appInfoModel.findOne(); // Refresh appinfo after update
        } else {
            appinfo = await appInfoModel.create({
                about_us: about_us,
                terms_condition: terms_condition,
                privacy_policy: privacy_policy
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Successfully updated app information',
            appinfo
        });
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