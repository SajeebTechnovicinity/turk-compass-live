const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.post('/create', slotController.create);
router.get('/list', slotController.list);
router.get('/duration-wise', slotController.durationWise);
router.get('/management-list', slotController.slotManageList);
router.post('/date-wise-slot', slotController.dateWiseSlot);
router.post('/edit', slotController.edit);
router.post('/delete', slotController.delete);

module.exports = router;
