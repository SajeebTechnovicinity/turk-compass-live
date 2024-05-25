const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route to list all categories
router.get('/list', notificationController.list);
module.exports = router;
