const express=require('express');
const { stripePaymentController, stripePaymentSuccess, freeSubscription } = require('../controllers/paymentController');

const route=express.Router();
// route    GET|POST|UPDATE|DELETE
route.get('/payment',stripePaymentController)
route.get('/payment-success',stripePaymentSuccess)
route.post('/payment-success',stripePaymentSuccess)
route.get('/payment-free',freeSubscription)
// export
module.exports=route