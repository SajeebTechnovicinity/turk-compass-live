const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

// Route to create a subcategory
router.post('/create', subCategoryController.create);
router.post('/edit', subCategoryController.edit);

// Route to list all subcategories
router.get('/list', subCategoryController.list);

module.exports = router;
