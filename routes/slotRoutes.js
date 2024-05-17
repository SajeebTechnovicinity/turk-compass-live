const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.post('/before-create', slotController.beforeCreate);
router.get('/list', slotController.list);

module.exports = router;
