const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.post('/create', slotController.create);
router.get('/list', slotController.list);

module.exports = router;
