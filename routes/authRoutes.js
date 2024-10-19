const express= require('express')
const { registerController, loginController,socialLoginController, resetPasswordController, updateResetPasswordController, userInfoGetController, passwordResetController, forgetPasswordController, verifyCodeController, changePassword, decodeToken } = require('../controllers/authController')
const router=express.Router()

router.post('/register',registerController)
// login 
router.post('/login',loginController)
router.post('/change-password',changePassword)
// social login 
router.post('/social/login',socialLoginController)
router.post('/resend-email',forgetPasswordController)
router.post('/verify-code',verifyCodeController)
// reset password
router.post('/reset',resetPasswordController)
router.post('/update/password',updateResetPasswordController)
router.get('/get',userInfoGetController)
router.post('/passeord-reset',passwordResetController)
//decoding token
router.post('/decode',decodeToken)
module.exports=router
