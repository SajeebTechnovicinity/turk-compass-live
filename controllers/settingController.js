const moment = require('moment');
const { AuthUser, uploadImageToCloudinary } = require('../utils/helper');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const faqModel = require('../models/faqModel');
const settingModel = require('../models/settingModel');
const consultateBranchModel = require('../models/consultateBranchModel');
const appInfoModel = require('../models/appInfoModel');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const settingController = {
    faqCreate: async (req, res) => {
        const { title, description } = req.body;
        try {
            const faqInfo = await faqModel.create({ title, description });
            res.status(201).send({
                success: true,
                message: "FAQ Created Successfully",
                faqInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error Api',
                error: error.message
            });
        }
    },
    faqGet: async (req, res) => {
        const faqInfo = await faqModel.find();
        res.status(201).send({
            success: true,
            faqInfo
        });
    },
    abountTermsPrivacy: (req, res) => {
        let setting = settingModel.findOne();
        if (setting) {
            settingModel.create({
                "about_us": about_us,
                "terms": terms,
                "privacy_policy": privacy_policy,
            })
        } else {
            settingModel.updateOne({
                "about_us": about_us,
                "terms": terms,
                "privacy_policy": privacy_policy,
            })
        }
    },
    consultateCreate:async (req, res) => {
        try {
            var {branch_info,consulate_info,consulate_img} = req.body;
            var info
            if(consulate_info || consulate_img){
                let que={}
                if(consulate_info){
                    que={...que,consulate_info}
                }
                if(consulate_img){
                    consulate_img = await uploadImageToCloudinary(consulate_img);
                    que={...que,consulate_img}
                }
                let appinfo=appInfoModel.findOne();
                if(appinfo){
                    info = await appInfoModel.create(que);
                }else{
                    info = await appInfoModel.findOneAndUpdate({},que);
                }
            }
            if(branch_info){
              info = await consultateBranchModel.insertMany(branch_info);
            }

            res.status(200).send({
                success: true,
                message: 'Successfully Created Consultate Branch',
                info
            }
            );
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error Api',
                error: error.message
            });
        }
    },
   consultateGet:async (req, res) => {
        try {
            var consultatInfo = await appInfoModel.findOne();
            var branchList = await consultateBranchModel.find();
            res.status(200).send({
                success: true,
                message: 'Successfully Retrieved Consultate Info and Branches',
                consultatInfo,
                branchList,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error Api',
                error: error.message,
            });
        }
    }
}

        // var query = {};
        // if (about_us && terms && privacy_policy) {
        //     query = {
        //         "about_us": about_us,
        //         "terms": terms,
        //         "privacy_policy": privacy_policy,
        //     };
        // }
        // if(home_banner){
        //     query = {
        //         "about_us": about_us,
        //         "terms": terms,
        //         "privacy_policy": privacy_policy,
        //     };
        // }
        module.exports = { settingController }