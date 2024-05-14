const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// Route to create a category
router.post('/create', countryController.create);

// Route to list all categories
router.get('/list', countryController.list);

module.exports = router;
