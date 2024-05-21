const express = require('express');
const router = express.Router();
const businessPostController = require('../controllers/businessPostController');

// Route to create a business post
router.post('/create', businessPostController.create);

// Route to list all business post 
router.get('/list', businessPostController.list);

// Route to update business post 
router.post('/edit', businessPostController.edit);

// Route to list all business search 
router.post('/search', businessPostController.search);

// Route to user id wise business post
router.get('/details', businessPostController.details);

// Route to id wise business post details
router.get('/id-wise-details', businessPostController.idWiseDetails);

module.exports = router;
