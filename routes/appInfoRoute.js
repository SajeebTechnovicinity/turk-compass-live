const express= require('express')
const { appInfoController } = require('../controllers/appInfoController')
const router=express.Router()
router.post('/create-update',appInfoController.abountTermsPrivacy)
router.get('/get',appInfoController.abountTermsPrivacyGet)

module.exports=router