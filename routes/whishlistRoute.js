const express = require('express');
const router = express.Router();
const whistlistController = require('../controllers/whistlistController');

// Route to create a category
router.post('/create', whistlistController.create);

// Route to list all categories
router.get('/list', whistlistController.list);

module.exports = router;
