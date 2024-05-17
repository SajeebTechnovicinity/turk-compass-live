const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.post('/create', slotController.create);
router.get('/list', slotController.list);
router.get('/duration-wise', slotController.durationWise);
router.get('/management-list', slotController.slotManageList);

module.exports = router;
