const moment = require('moment');
const { AuthUser, isBase64Image, uploadImageToCloudinary, sendPushNotification } = require('../utils/helper');
const bannerModel = require('../models/bannerModel');
const paymentModel = require('../models/paymentModel');
const stripe = require('stripe')(process.env.STRIPE_KEY);


const bannerController = {
    createUpdate: async (req, res) => {
        try {
            const user_info = await AuthUser(req);
            const user_id = user_info.id;
            let { title,
                offer_title,
                link,
                cover_img, id } = req.body;
            let isBase64 = isBase64Image(cover_img);
            var bannerInfo;
        
            if (isBase64 && cover_img) {
                cover_img = await uploadImageToCloudinary(cover_img);
            }
            if(id){
                let query={title,offer_title,link}
                if(cover_img){
                    query.cover_img=cover_img
                }
                bannerInfo = await bannerModel.findByIdAndUpdate({_id:id},query,{new: true}),
                res.status(200).send({
                    success:true,
                    message: "Successfully updated",
                    bannerInfo
                })
                
            }else{
             
                bannerInfo = await bannerModel.create({title,offer_title,link,cover_img,user_id})
            }
            // stripe payment
            let bannerId = bannerInfo._id;

            // if (isNaN(amountInDollars) || amountInDollars <= 0) {
            //   return res.status(400).send("Invalid amount");
            // }

            const amountInCents = 10 * 100;

            // Create a Stripe checkout session

            const origin = process.env.APP_URL;
            var stripe_id = "stripe_payment"
            var data={amount:amountInCents,user_id:user_id,id_stripe:"stripe_payment"}
            const stripeSession = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "Turk Compass Banner add Payment",
                            },
                            unit_amount: amountInCents,
                        },
                        quantity: 1,
                    },
                ],

                mode: "payment",
                success_url: `${origin}/api/v1/banner/success-payment?bannerId=${bannerId}&amount=${amountInCents}&user_id=${user_id}&id_stripe=${stripe_id}`,
                cancel_url: `${origin}/api/v1/banner/cancel-payment?bannerId=${bannerId}`,
            });

            

            res.status(200).send({
                success: true,
                message: "success payment",
                data:stripeSession
            })


            // // Set a cookie with the sessionId
            // res.cookie("sessionId", stripeSession.id, { httpOnly: true });

            // // Redirect to Stripe checkout page
            // res.redirect(303, stripeSession.url);
            // stripe payment

            // res.status(200).send({
            //     success: true,
            //     message: "Successfully created a new banner",
            // });

        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: false,
                message: error.message,
                error: error
            })
        }
    },
    bannerList:async (req, res) => {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        
        let query = { payment_status:1,createdAt: { $gte: thirtyDaysAgo }};
        // const bannerList=await bannerModel.find(query)
        var random = Math.floor(Math.random())
        const bannerList = await bannerModel.aggregate([
            { $match: query },
            { $sample:  { size: 10 } } // Adjust the size as needed
        ]);
        res.status(200).send({
            success: true,
            message: "banner list",
            bannerList
        })
    },
    userWiseBannerList:async (req, res) => {
        const user_info = await AuthUser(req);
        const user_id = user_info.id;
        const currentDate = new Date();
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        
        let query = { payment_status:1, user:user_id};
        // const bannerList=await bannerModel.find(query)
        var random = Math.floor(Math.random())
        const bannerList = await bannerModel.aggregate([
            { $match: query },
          
        ]).sort({createdAt:1});
        res.status(200).send({
            success: true,
            message: "banner list",
            bannerList
        })
    },
    allList:async (req, res) => {
        let query = { is_delete:0};
        const bannerList=await bannerModel.find(query)
        res.status(200).send({
            success: true,
            message: "banner list",
            bannerList
        })
    },
    myBannerList:async (req, res) => {
        const user_info = await AuthUser(req);
        const user_id = user_info.id;
        let query = {user_id:user_id};
        const bannerList=await bannerModel.find(query).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "banner list",
            bannerList,
    
        })
    },
    successPayment: async (req, res) => {
     const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let bannerId =  searchParams.get("bannerId");
        let amount = searchParams.get("amount");
        let id_stripe = searchParams.get("id_stripe");
        let user_id = searchParams.get("user_id");

        const updatedBanner = await bannerModel.findOneAndUpdate(
            { _id: bannerId },
            { payment_status: 1 },
            { new: true } // Option to return the updated document
        );
        paymentModel.create({type:"banner", user_id: user_id, amount: amount,payment_id:id_stripe});
        res.status(200).send({
            success: true,
            message: "Successfully  Payment Completed",
            bannerId,
        })

    },
    cancelPayment: async (req, res) => {
        res.status(500).send({
            success: false,
            message: " Payment not Completed"
        
        })

    }

}
module.exports = { bannerController }