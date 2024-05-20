const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');


// Route to general profile
router.get('/list', profileController.list);
//business profile
router.get('/business/list', profileController.businessProfilelist);
// Route to user profile update
router.post('/update', profileController.update);

module.exports = router;
