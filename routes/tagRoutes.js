const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

// Route to create a tag
router.post('/create', tagController.create);
router.post('/edit', tagController.edit);

// Route to list all tags
router.get('/list', tagController.list);
module.exports = router;
