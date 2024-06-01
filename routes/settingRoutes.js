const express=require('express');
const { settingController } = require('../controllers/settingController');

const route=express.Router();
// route    GET|POST|UPDATE|DELETE
route.post('/create',settingController.faqCreate)
route.post('/create-about-us',settingController.faqCreate)
route.get('/get-faq',settingController.faqGet)
route.get('/consultate-create',settingController.consultateCreate)

// export
module.exports=route