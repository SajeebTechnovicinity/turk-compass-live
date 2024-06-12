const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route to create a contact
router.post('/create', contactController.create);

// Route to list all contacts
router.get('/list', contactController.list);
module.exports = router;
