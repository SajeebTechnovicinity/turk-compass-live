const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');


// Route to general profile
router.get('/list', profileController.list);
router.post('/general/info-update', profileController.generalInfoUpdate);
router.get('/general/info-get', profileController.generalInfoGet);
router.get('/general/delete', profileController.delteProfile);
router.get('/general/active-inactive', profileController.profileActiveInactive);
//business profile
router.get('/business/list', profileController.businessProfilelist);
//Route to user profile update
router.post('/update', profileController.update);
router.post('/device-token/update', profileController.deviceTokenupdate);

//Route job Profile
router.post('/job-profile/create-update', profileController.jobProfileCreateUpdate);
router.get('/job-profile/get', profileController.jobProfileGet);

module.exports = router;
