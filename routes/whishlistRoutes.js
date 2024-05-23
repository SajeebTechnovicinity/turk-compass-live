const express = require('express');
const router = express.Router();
const whistlistController = require('../controllers/whistlistController');

// Route to create a whistlist
router.post('/create', whistlistController.create);

// Route to list all whistlists
router.get('/list', whistlistController.list);

// Route to delete a whistlist
router.post('/delete', whistlistController.delete);

module.exports = router;
