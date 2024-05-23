const express= require('express')
const { registerController, loginController,socialLoginController, resetPasswordController, updateResetPasswordController, userInfoGetController, passwordResetController} = require('../controllers/authController')
const router=express.Router()

router.post('/register',registerController)
// login 
router.post('/login',loginController)
// social login 
router.post('/social/login',socialLoginController)
// reset password
router.post('/reset',resetPasswordController)
router.post('/update/password',updateResetPasswordController)
router.get('/get',userInfoGetController)
router.get('/passeord-reset',passwordResetController)
module.exports=router
