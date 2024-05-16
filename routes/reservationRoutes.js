const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/create', reservationController.create);
router.get('/list', reservationController.list);
router.get('/details', reservationController.details);

module.exports = router;