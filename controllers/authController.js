const userModel = require("../models/userModel");
const bcrypt= require('bcrypt');
const { request } = require("express");
const jwt=require('jsonwebtoken')
const path = require('path');
const ejs=require('ejs')
const fs=require('fs')
const nodemailer = require('nodemailer');
const userController = require("./userController");

const registerController =async(req,res)=>{
    try{
        const {userName,email,password}=req.body;
        // validation
        if(!userName || !email || !password){
            return res.status(500).send({
                success:false,
                message:'please provide all fields'
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        // check 
        const exisiting=await userModel.findOne({email});

        if(exisiting){
            return res.status(200).send({
                success:false,
                message:'Email already Registerd please login'
            })
        }
        const srcky=process.env.BCRYP_KEY
        const user=await userModel.create({userName:userName,email:email,password:hashPassword,slot_duration:0,is_multiple_reservation_available:0,is_reservation_available:0})
        const id=user.id;
        const user_type=user.usertype;
        const package_type=user.package_type;
        const slot_duration=user.slot_duration;
        const is_multiple_reservation_available=user.is_multiple_reservation_available;
        const is_reservation_available=user.is_reservation_available;
    

        let token = jwt.sign({userName,email,user_type,package_type,id,is_multiple_reservation_available,slot_duration,is_reservation_available},srcky,{ expiresIn: '1h' });
        const info={
            token:token,
            user_info:user,
        }

        const emailTemplatePath = path.resolve(__dirname, "views", "mails", "welcome_mail.ejs");
        const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
        const resetLink="link";
        const mailContent = ejs.render(emailTemplate, {resetLink,name:user.userName});
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Set to false for explicit TLS
            auth: {
                user: 'technovicinity.dev@gmail.com',
                pass: 'wsvrvojuwyraazog',
            },
            tls: {
                // Do not fail on invalid certificates
                //rejectUnauthorized: false,
            },
        });
        const mailOptions = {
           from: process.env.EMAIL_USER,
           to: email,
           subject: "Turk's  Welcome Email",
           html: mailContent,
       };
    
       // Send the email
       await transporter.sendMail(mailOptions);


        res.status(201).send({
            success:true,
            message:"successfully Register User",
            data:info
            

        })
    }catch(error){
             console.log(error)
             res.status(500).send({
                success:false,
                message:'error in register api',
                error:error.message
             })
    }
}
const loginController=async(req,res)=>{
    try{
    const {email,password,}=req.body;
    const record = {email: email};
    // validation
    if(!email || !password){
        return res.status(500).send({
            success:false,
            message:'please provide all fields'
        })
    }
    // check 
    const user=await userModel.findOne({email:email});
    if(!user){
        return res.status(403).send({
            success:false,
            message:'User not found'
        })
    }
    if(user && user.is_delete==true){
        return res.status(403).send({
            success:false,
            message:'Your account is not activated'
        })
    }
    const userName=user.userName;

    let is_user = await bcrypt.compare(password, user.password);
    if(!user || !is_user){
        return res.status(404).send({
            success:false,
            message:'Email Or password invalid'
        })
    }

    if(is_user){
        const id=user.id;
        const user_type=user.usertype;
        const package_type=user.package_type;
        const is_multiple_reservation_available=user.is_multiple_reservation_available;
        const is_reservation_available=user.is_reservation_available;
        const slot_duration=user.slot_duration;
        const srcky=process.env.BCRYP_KEY
        let token = jwt.sign({userName,email,user_type,package_type,id,is_multiple_reservation_available,slot_duration,is_reservation_available},srcky,{ expiresIn: '1h' });
        const info={
            token:token,
            user_info:user,
        }
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            info
        })
    }

    

 
}catch(error){
    console.log(error)
    res.status(500).send({
       success:false,
       message:'error in login api',
       error:error
    })
}

}

const socialLoginController=async(req,res)=>{
    try{
    const {email,key}=req.body;
    const record = {email: email};
    // validation
    if(!email || !(key==="tk19992")){
        return res.status(200).send({
            success:false,
            message:'please provide all fields correctly'
        })
    }
    // check 
    const user=await userModel.findOne(record);
    if(!user){
        const user=await userModel.create({email:email,slot_duration:0,is_multiple_reservation_available:0,is_reservation_available:0});
        const id=user.id;
        const userName=user.userName && "";
        const user_type=user.usertype;
        const package_type=user.package_type;
        const is_multiple_reservation_available=user.is_multiple_reservation_available;
        const is_reservation_available=user.is_reservation_available;
        const slot_duration=user.slot_duration;
        const srcky=process.env.BCRYP_KEY
        let token = jwt.sign({userName,email,user_type,package_type,id,is_multiple_reservation_available,slot_duration,is_reservation_available},srcky,{ expiresIn: '1h' });

        const info={
            token:token,
            user_info:user,
        }

    }
    const userName=user.userName;
    let is_user = user
    if(is_user){
        const id=user.id;
        const user_type=user.usertype;
        const package_type=user.package_type;
        const srcky=process.env.BCRYP_KEY
        let token = jwt.sign({userName,email,user_type,package_type,id},srcky,{ expiresIn: '1h' });
        const info={
            token:token,
            user_info:user,
        }
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            info
        })
    }
}catch(error){
    console.log(error)
    res.status(500).send({
       success:false,
       message:'error in login api dfgh',
       error:error
    })
}
}
const resetPasswordController=async(req,res)=>{
    const {email}=req.body;
    var userInfo= await userModel.findOne({email:email});
    if(!userInfo){
        res.status(500).send({
            success:false,
            message:'No user found',
         })
    }
    var code =  Math.floor(100000 + Math.random() * 900000);

    userInfo = await userModel.findOneAndUpdate(
        { email: email }, // Query criteria to find the document
        { reset_code: code, reset_code_time: new Date() }, // Update object
        { new: true } // Option to return the updated document
    );

    // res.status(200).send({
    //     success:true,
    //     message:'successfully reset code send to your mail',
    //     userInfo:userInfo.userName,
    //  })

    const emailTemplatePath = path.resolve(__dirname, "views", "mails", "forget_password.ejs");
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
    const resetLink="link";
    const mailContent = ejs.render(emailTemplate, {resetLink,name:userInfo.userName,date:new Date(),code:userInfo.reset_code});
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Set to false for explicit TLS
        auth: {
            user: 'technovicinity.dev@gmail.com',
            pass: 'wsvrvojuwyraazog',
        },
        tls: {
            // Do not fail on invalid certificates
            //rejectUnauthorized: false,
        },
    });
    const mailOptions = {
       from: process.env.EMAIL_USER,
       to: email,
       subject: "Turk's  Account Password Reset",
       html: mailContent,
   };

   // Send the email
   await transporter.sendMail(mailOptions);
   res.status(200).send({
    success:true,
    message:'successfully reset code send to your mail',
    userInfo,
 })
}

const updateResetPasswordController=async(req,res)=>{

    const {email,password,code}=req.body;

    if(!password){
        const userInfo = await userModel.findOne({ email: email, reset_code: code });
        if(userInfo){
            res.status(200).send({
                success:true,
                message:'code is valid',
                userInfo,
             })
        }else{
            res.status(401).send({
                success:false,
                message:'code is  not  valid',
                userInfo,
             })
        }
    }else{

        const hashPassword = await bcrypt.hash(password, 10);
        const userInfo = await userModel.findOneAndUpdate(
            { email: email, reset_code: code },  // Filter criteria
            { password: hashPassword,reset_code:""},          // Update operation
            { new: true }       // Options: return the updated document
        );
        if(userInfo){
            res.status(200).send({
                success:true,
                message:'successfully password updated',
                userInfo,
             })
        }else{
            res.status(401).send({
                success:true,
                message:'Code is not valid',
             }) 
        }

    }
}

const passwordResetController=async(req,res)=>{
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    let email =searchParams.get('email');
    let password =searchParams.get('password');
    const hashPassword = await bcrypt.hash(password, 10);
    const userInfo = await userModel.findOneAndUpdate(
        { email: email},  // Filter criteria
        { password: hashPassword},          // Update operation
        { new: true }       // Options: return the updated document
    );
    res.status(200).send({
        success:true,
        message:'Successfully password updated',
        userInfo,
     })
}

const userInfoGetController=async(req,res)=>{
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    let page = Number(searchParams.get('page')) || 1;
    let limit = Number(searchParams.get('limit')) || 12;
    let skip = (page - 1) * limit;

    const count = await userModel.countDocuments();
            
    const totalPages = Math.ceil(count / limit);

    let userList=await userModel.find().limit(limit).skip(skip);
    res.status(200).send({
        success:true,
        message:'successfully password updated',
        userList,
        totalPages,
        currentPage: page
     })
}




module.exports={registerController,loginController,socialLoginController,resetPasswordController,updateResetPasswordController,userInfoGetController,passwordResetController};