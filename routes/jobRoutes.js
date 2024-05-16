const express= require('express')
const { jobController } = require('../controllers/jobController')
const router=express.Router()
// job Create 
router.post('/create',jobController.create);
// job apply
router.post('/apply',jobController.apply)
router.post('/industry-create',jobController.industry)
router.get('/industry-get',jobController.industryGet)
module.exports=router