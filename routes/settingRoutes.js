const express=require('express');
const { settingController } = require('../controllers/settingController');

const route=express.Router();
// route    GET|POST|UPDATE|DELETE
route.post('/create',settingController.faqCreate)
route.get('/get-faq',settingController.faqGet)

// export
module.exports=route