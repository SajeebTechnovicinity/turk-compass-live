const express= require('express')
const { bannerController } = require('../controllers/bannerController')
const router=express.Router()
router.post('/create-update',bannerController.createUpdate)
router.get('/success-payment',bannerController.successPayment)
router.get('/cancel-payment',bannerController.cancelPayment)

router.get('/paid-banner',bannerController.bannerList)
router.get('/all-banner',bannerController.allList)
router.get('/my-banner',bannerController.myBannerList)




module.exports=router