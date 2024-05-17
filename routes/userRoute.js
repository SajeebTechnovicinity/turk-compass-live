const express=require('express');
const { testUserController } = require('../controllers/testController');
const userController = require('../controllers/userController');
const { userInfoGetController } = require('../controllers/authController');

const route=express.Router();
// route    GET|POST|UPDATE|DELETE
route.get('/test-user',testUserController)
route.get('/get',userInfoGetController)

// export
module.exports=route