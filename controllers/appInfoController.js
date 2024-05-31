const moment = require("moment");
const { AuthUser, uploadImageToCloudinary } = require("../utils/helper");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const faqModel = require("../models/faqModel");
const settingModel = require("../models/settingModel");
const appInfoModel = require("../models/appInfoModel");
const petitionModel = require("../models/petitionModel");

const appInfoController = {
  abountTermsPrivacy: async (req, res) => {
    const { about_us, terms_condition, privacy_policy } = req.body;
    let appinfo = appInfoModel.findOne();
    if (appinfo) {
      appInfoModel.updateOne({
        about_us: about_us,
        terms_condition: terms_condition,
        privacy_policy: privacy_policy,
      });
    } else {
      appinfo = await appInfoModel.create({
        about_us: about_us,
        terms_condition: terms_condition,
        privacy_policy: privacy_policy,
      });
    }
    res.status(200).send({
      success: true,
      message: "successfully password updated",
      appinfo,
    });
  },
  petitionCreateUpdate: async (req, res) => {
    try {
      const { petition } = req.body;
      let petitionData = petition;

      if (petitionData.image) {
        image = await uploadImageToCloudinary(petitionData.image);
        petitionData = { ...petitionData, image };
      }
      let info = petitionModel.create(petitionData);
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

  abountTermsPrivacyGet: async (req, res) => {
    let appinfo = await appInfoModel.findOne();
    res.status(200).send({
      success: true,
      message: "successfully password updated",
      appinfo,
    });
  },
};
module.exports = { appInfoController };
