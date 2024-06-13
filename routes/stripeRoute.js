const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

// Route to create a payment
router.get('/event-payment', stripeController.eventPayment);
router.get('/success', stripeController.success);
router.get('/cancel', stripeController.cancel);

module.exports = router;
