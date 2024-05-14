const express = require('express');
const router = express.Router();
const businessPostController = require('../controllers/businessPostController');

// Route to create a business post
router.post('/create', businessPostController.create);

// Route to list all business post 
router.get('/list', businessPostController.list);

// Route to list all business search 
router.post('/search', businessPostController.search);

module.exports = router;
