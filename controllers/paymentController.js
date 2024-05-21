const moment = require('moment');
const { AuthUser } = require('../utils/helper');
const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel');

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

const stripePaymentSuccess=async(req,res)=>{
    const { sessionId } = req.body;
    var user_data

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      if (session.payment_status === 'paid') {
          const subscriptionId = session.subscription;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userInfo=await AuthUser(req);
          if(!userInfo){

            res.status(401).send(
                {
                    success:false,
                    message:"Unauthorize user",
                }
            )
          }
    
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            // const user = await admin.auth().getUser(firebaseId);
            const planId = subscription.plan.id;
            const planType = "free"
            const amount=subscription.plan.amount;

            // Package
            if(amount==499) planType="premium";
            if(amount==999) planType="premium_employer";
            if(amount==199) planType="job_seeker";
            // Package

            const startDate = moment.unix(subscription.current_period_start).format('YYYY-MM-DD');
            const endDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD');
            const durationInSeconds = subscription.current_period_end - subscription.current_period_start;
            const durationInDays = moment.duration(durationInSeconds, 'seconds').asDays();

            user_data=await userModel.updateOne({ _id: userInfo.id }, { $set: {package_type:planType,package_start_date:startDate,package_end_date:endDate,package_duration:durationInDays} })
            
            res.status(200).send(
                {
                    success:true,
                    message:"stripe payment",
                    // data:subscription,
                    user:user_data,    
                }
            )
            } catch (error) {
              console.error('Error retrieving subscription:', error);
            }
        
            res.status(200).send(
                {
                    success:true,
                    message:"stripe payment",
                    data:subscription,
                    user:user_data,  
             
                }
            )
        } else {
          return res.json({ message: "Payment failed" });
        }
      } catch (error) {
        res.send(error);
      }

}
const freeSubscription=async(req,res)=>{
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
}



module.exports={stripePaymentController,stripePaymentSuccess,freeSubscription}