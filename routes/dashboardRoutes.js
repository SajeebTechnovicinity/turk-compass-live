const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/show', dashboardController.show);


module.exports = router;
