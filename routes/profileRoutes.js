const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');


// Route to general profile
router.get('/list', profileController.list);
//business profile
router.get('/business/list', profileController.businessProfilelist);
//Route to user profile update
router.post('/update', profileController.update);

//Route job Profile
router.post('/job-profile/create-update', profileController.jobProfileCreateUpdate);
router.get('/job-profile/get', profileController.jobProfileGet);

module.exports = router;
