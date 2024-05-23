const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.post('/create', cityController.create);
router.post('/edit', cityController.create);
router.get('/list', cityController.list);

module.exports = router;
