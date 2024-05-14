const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');

router.post('/create', stateController.create);
router.get('/list', stateController.list);

module.exports = router;
