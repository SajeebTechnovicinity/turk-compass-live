// Import necessary modules
const Stripe = require("stripe");
const appInfoModel = require("../models/appInfoModel");
const eventModel = require("../models/eventModel");
const { AuthUser } = require("../utils/helper");
const paymentModel = require("../models/paymentModel");

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_KEY);

// Define stripeController methods
const stripeController = {
  // Method to create a new stripe payment session
  eventPayment: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let eventId = searchParams.get("id");

      // Fetch app info from MongoDB (assuming mongoose or similar)
      const appInfo = await appInfoModel.findOne();

      // Validate amount
      const amountInDollars = appInfo.amount;
      if (isNaN(amountInDollars) || amountInDollars <= 0) {
        return res.status(400).send("Invalid amount");
      }

      const amountInCents = parseInt(amountInDollars) * 100;

      // Create a Stripe checkout session
      const origin = process.env.APP_URL;
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Turk Compass Event Payment",
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/api/v1/stripe/success?eventId=${eventId}`,
        cancel_url: `${origin}/api/v1/stripe/cancel`,
      });

      console.log("Stripe session created:", stripeSession);

      // Set a cookie with the sessionId
      res.cookie("sessionId", stripeSession.id, { httpOnly: true });

      // Redirect to Stripe checkout page
      res.redirect(303, stripeSession.url);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).send(`Error creating checkout session: ${error.message}`);
    }
  },

  // Success endpoint after payment completion
  success: async (req, res) => {
    try {
      // Retrieve eventId from query parameters
      const eventId = req.query.eventId;
      const appInfo = await appInfoModel.findOne();
      // Validate amount
      const amountInDollars = appInfo.amount;

      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        const transactionNumber = result;
   
     // Get current date for payment_date
     const currentDate = new Date(); // Current date and time

     // Update event document in MongoDB
     const eventUpdated = await eventModel.findOneAndUpdate(
       { _id: eventId },
       {
         payment_amount: amountInDollars,
         payment_date: currentDate, // Assigning current date
         payment_method: 'Stripe',
         tnx_number: transactionNumber,
         is_payment_complete: true,
       },
       { new: true } // To return updated document
     );

     var userInfo = await AuthUser(req);
     paymentModel.create({type:"event", user_id: userInfo.id, amount: amountInDollars,payment_id:transactionNumber});
      // Respond with success message and transaction details
      res.status(200).send({
        success: true,
        message: "Payment successfully done",
        transaction_number: transactionNumber,
        amount: amountInDollars,
        eventInfo: eventUpdated
      });
    } catch (error) {
      console.error("Error retrieving session details:", error);
      res.status(403).send({
        success: false,
        message: error.message,
      });
    }
  },

  // Cancel endpoint if payment is canceled
  cancel: async (req, res) => {
    try {
      res.status(200).send({
        success: true,
        message: "Payment was cancelled",
      });
    } catch (error) {
      res.status(403).send({
        success: false,
        message: error.message,
      });
    }
  },
  
};

// Export stripeController
module.exports = stripeController;
