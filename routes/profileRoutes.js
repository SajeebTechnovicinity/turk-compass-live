const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');


// Route to user profile
router.get('/list', profileController.list);

module.exports = router;
