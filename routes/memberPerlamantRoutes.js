const express = require('express');
const router = express.Router();
const memberPerlamentController = require('../controllers/memberPerlamentController');

// Route to create a member of perlamant
router.post('/create', memberPerlamentController.create);

// Route to list all member of perlamants
router.get('/list', memberPerlamentController.list);

// Route to list all member of perlamants
router.get('/details', memberPerlamentController.details);

// Route to list all member of perlamants
router.post('/edit', memberPerlamentController.edit);

// Route to search member of perlamants
router.get('/search', memberPerlamentController.search);

// Route to search member of perlamants
router.get('/delete', memberPerlamentController.delete);

module.exports = router;
