const express=require('express');
const { settingController } = require('../controllers/settingController');

const route=express.Router();
// route    GET|POST|UPDATE|DELETE
route.post('/create',settingController.faqCreate)

// export
module.exports=route