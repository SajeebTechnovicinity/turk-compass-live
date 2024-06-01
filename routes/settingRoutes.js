const express=require('express');
const { settingController } = require('../controllers/settingController');

const route=express.Router();
// route    GET|POST|UPDATE|DELETE
route.post('/create',settingController.faqCreate)
route.post('/create-about-us',settingController.faqCreate)
route.get('/get-faq',settingController.faqGet)
route.post('/consultate-create',settingController.consultateCreate)
route.get('/get-consultate',settingController.consultateGet)

// export
module.exports=route