const moment = require('moment');
const { AuthUser } = require('../utils/helper');
const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel');
const paymentModel = require('../models/paymentModel');
const { startOfDay, endOfDay } = require('date-fns');

const stripe = require('stripe')(process.env.STRIPE_KEY);

const stripePaymentController=async(req,res)=>{
    try{
        const { price_key } = req.query;
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [{
                price:price_key, // Replace 'price_123' with the actual Price ID
                quantity: 1,
            }],
            success_url: "http://localhost:8080/success",
            cancel_url: "http://localhost:8080/cancel"
        });
        
        res.status(200).send(
            {
                success:true,
                message:"stripe payment",
                data:session,
                price:price_key,
            }
        )
    }catch(error){
        console.error("Error in testUserController:", error);
    }
}

const stripePaymentSuccess = async (req, res) => {
    const { package_type,package_start_date,package_end_date,package_duration,sessionId,payment_method,payment_trnx_number } = req.body;
  
    var user_data;
    var userInfo = await AuthUser(req);

    try {
        
        if(payment_method=="apple_pay" || payment_method=="google_pay"){
        
            user_data = await userModel.findOneAndUpdate(
                { _id: userInfo.id },
                {
                    $set: {
                        package_type: package_type,
                        package_start_date: package_start_date,
                        package_end_date: package_end_date,
                        package_duration: package_duration,
                        payment_method: payment_method,
                        payment_trnx_number: payment_trnx_number,
                    }
                }
            );



            return res.status(200).send({
                success: true,
                message: payment_method+" payment successful",
                user_data
            });


        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        

        if (session.payment_status === 'paid') {

         

            const subscriptionId = session.subscription;
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);


            if (!userInfo) {
                return res.status(401).send({
                    success: false,
                    message: "Unauthorized user",
                });
            }
          
            const planId = subscription.plan.id;
            let planType = "free";
            const amount = subscription.plan.amount;
            // Package
            if (amount == 499) planType = "premium";
            if (amount == 999) planType = "premium_employer";
            if (amount == 199) planType = "job_seeker";
            // Package 
            const startDate = moment.unix(subscription.current_period_start).format('YYYY-MM-DD');
            const endDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD');
            const durationInSeconds = subscription.current_period_end - subscription.current_period_start;
            const durationInDays = moment.duration(durationInSeconds, 'seconds').asDays();


            user_data = await userModel.findOneAndUpdate(
                { _id: userInfo.id },
                {
                    $set: {
                        package_type: planType,
                        package_start_date: startDate,
                        package_end_date: endDate,
                        package_duration: durationInDays
                    }
                }
            );
           var payment=amount/100;
            paymentModel.create({type:"subscription", user_id: userInfo.id, amount: payment,payment_id:subscriptionId});
            return res.status(200).send({
                success: true,
                message: "Stripe payment successful",
                user_data
            });

        } else {
            return res.status(400).send({ message: "Payment failed" });
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

const paymentReport=async(req,res)=>{
    try{
        const {startDate,endDate,type} = req.body;

        // $gte: startOfDay(new Date(startDate)),
        // $lte: endOfDay(new Date(endDate))
    let payments;
    console.log(startDate);
    console.log(endDate);
    const moment = require('moment'); // Make sure to install moment.js using `npm install moment`

    if (startDate != null && endDate != null) {
        // Convert startDate and endDate to Date objects
        let start = moment(startDate).startOf('day').toDate();
        let end = moment(endDate).add(1, 'days').startOf('day').toDate();
    
        payments = await paymentModel.find({
            "date": {
                $gte: start,
                $lte: end
            },
            "type": type
        }).populate([{
            path: "user_id",
            model: "User"
        }]);
        console.log("payment");
        console.log(payments);
    } else {
        payments = await paymentModel.find({
            "type": type
        }).populate([{
            path: "user_id",
            model: "User"
        }]);
    }


    res.status(200).send(
        {
            success:true,
            message:"stripe payment",
            payments
        
        }
    )


    }
    catch (error) {
        return res.status(200).send(error.message);
    }

}


const freeSubscription=async(req,res)=>{
    try{
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        const user_info = await AuthUser(req);
        const user_id = user_info.id;
        const package_type=searchParams.get('package_type');
        if(package_type=="job_seeker"){
            var now = new Date();
            var dateString = moment(now).format('YYYY-MM-DD');
            job_seeker_free_start_date=dateString;
        }else{
            job_seeker_free_start_date=null;
        }
        var user_data=await userModel.findOneAndUpdate({ _id: user_id }, {package_type:package_type,job_seeker_free_start_date:job_seeker_free_start_date} );
    
        res.status(200).send(
            {
                success:true,
                message:"stripe payment",
                user_data
            }
        )
    }catch (error) {
        return res.status(500).send(error);
    }

}



module.exports={stripePaymentController,stripePaymentSuccess,freeSubscription,paymentReport}