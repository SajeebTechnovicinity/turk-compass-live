const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.post('/create', cityController.create);
router.post('/edit', cityController.edit);
router.get('/list', cityController.list);
router.get('/admin/list', cityController.adminlist);

module.exports = router;
