const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');


// Route to general profile
router.get('/list', profileController.list);
router.post('/general/info-update', profileController.generalInfoUpdate);
router.get('/general/info-get', profileController.generalInfoGet);
router.get('/general/delete', profileController.delteProfile);
router.get('/general/active-inactive', profileController.profileActiveInactive);
router.get('/general/status-active-inactive', profileController.profileStatusActiveInactive);

router.get('/business/active-inactive', profileController.businessProfileActiveInactive);
//business profile
router.get('/business/list', profileController.businessProfilelist);
//Route to user profile update
router.post('/update', profileController.update);
router.post('/device-token/update', profileController.deviceTokenupdate);

//Route job Profile
router.post('/job-profile/create-update', profileController.jobProfileCreateUpdate);
router.get('/job-profile/get', profileController.jobProfileGet);

router.get('/all', profileController.allProfile);

// Route to update language
router.post('/language/update', profileController.languageUpdate);
module.exports = router;
