const express=require('express');
const { stripePaymentController, stripePaymentSuccess, freeSubscription, paymentReport } = require('../controllers/paymentController');

const route=express.Router();
// route    GET|POST|UPDATE|DELETE
route.get('/payment',stripePaymentController)
route.get('/payment-success',stripePaymentSuccess)
route.post('/payment-success',stripePaymentSuccess)
route.get('/payment-free',freeSubscription)
route.post('/payment-report',paymentReport)
// export
module.exports=route