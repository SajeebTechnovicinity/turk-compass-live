const express= require('express')
const { appInfoController } = require('../controllers/appInfoController')
const router=express.Router()
router.post('/create-update',appInfoController.abountTermsPrivacy)
router.get('/get',appInfoController.abountTermsPrivacyGet)
router.post("/petition/create-update", appInfoController.petitionCreateUpdate);
router.get("/petition/petitionList", appInfoController.petitionList);

module.exports=router