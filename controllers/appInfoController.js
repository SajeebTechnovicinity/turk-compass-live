const moment = require('moment');
const { AuthUser, isBase64Image, uploadImageToCloudinary } = require('../utils/helper');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const faqModel = require('../models/faqModel');
const settingModel = require('../models/settingModel');
const appInfoModel = require('../models/appInfoModel');
const petitionModel = require('../models/petitionModel');

const appInfoController = {
    abountTermsPrivacy: async (req, res) => {
        try{

            var { about_us, terms_condition, privacy_policy,home_banner,is_google_email} = req.body;

            let appinfo = await appInfoModel.findOne();
            var query = {is_google_email:is_google_email};
            if (about_us && terms_condition && privacy_policy) {
                query = {
                    about_us: about_us,
                    terms_condition: terms_condition,
                    privacy_policy: privacy_policy,
                    is_google_email:is_google_email
                };
            }
            if (home_banner) {
                let isBase64=isBase64Image(home_banner.image);
                if(isBase64){
                    var imgurl = await uploadImageToCloudinary(home_banner.image);
                    home_banner={...home_banner,image:imgurl}
                }
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
    },
    petitionDelete:async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let id =searchParams.get('id');
        let appinfo = await petitionModel.findOneAndDelete({_id:id})
        res.status(200).send({
            success: true,
            message: 'successfully Deleted',
            appinfo,
        })
    },
    petitionCreateUpdate: async (req, res) => {
        try {
          const { petition } = req.body;
          let petitionData = petition;
    
          if (petitionData.image) {
            image = await uploadImageToCloudinary(petitionData.image);
            petitionData = { ...petitionData, image };
          }
          let info = await petitionModel.create(petitionData);
          res.status(200).send({
            success: true,
            message: "successfully created",
            info,
          });
        } catch (error) {
          res.status(500).send({
            success: false,
            message: error.message,
            error: error.message,
          });
        }
      },
      petitionList: async (req, res) => {
        try {
          var info = await petitionModel.find();
          res.status(200).send({
            success: true,
            message: "successfully created",
            info,
          });
        } catch (error) {
          res.status(500).send({
            success: false,
            message: error.message,
            error: error.message,
          });
        }
      },
}
module.exports = { appInfoController }