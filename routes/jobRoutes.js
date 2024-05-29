const express= require('express')
const { jobController } = require('../controllers/jobController')
const router=express.Router()
// job Create 
router.post('/create',jobController.create);
router.get('/get',jobController.jobGet)
router.get('/job-details',jobController.jobDetails)
// job apply
router.post('/apply',jobController.apply)
router.get('/my-apply',jobController.myApplyList)
router.post('/industry-create',jobController.industry)
router.post('/industry-update',jobController.industryUpdate)
router.get('/industry-get',jobController.industryGet)
router.get('/my-list',jobController.myJobListyGet)

router.get('/add/short-list',jobController.addShortList)
router.get('/short-list',jobController.myJobShortList)

// job  candidate list
router.get('/candidate-list',jobController.jobCandidateListyGet)
router.get('/all-list',jobController.allJobListGet)
// job wishlist
router.get('/wish-list/add-delete',jobController.jobwishListAddDelete),
router.get('/wish-list',jobController.myJobwishList)

router.get('/industry-wise-amount',jobController.industryWiseJob)
module.exports=router