const express = require('express');
const businessClaimController = require('../controllers/businessClaimController');
const router = express.Router();

// Route to create a business post
router.post('/create', businessClaimController.create);

// Route to list all business post 
router.get('/list', businessClaimController.list);

router.get('/approve', businessClaimController.approve);
router.get('/reject', businessClaimController.reject);

module.exports = router;
