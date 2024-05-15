const express= require('express')
const { registerController, loginController,socialLoginController, resetPasswordController } = require('../controllers/authController')
const router=express.Router()

router.post('/register',registerController)
// login 
router.post('/login',loginController)
// social login 
router.post('/social/login',socialLoginController)
// reset password
router.post('/reset',resetPasswordController)
module.exports=router