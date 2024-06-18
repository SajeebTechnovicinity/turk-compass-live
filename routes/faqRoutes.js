const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// Route to create a faq
router.post('/create', faqController.create);
router.post('/edit', faqController.edit);

// Route to list all faqs
router.get('/list', faqController.list);
// Route to delete a faq
router.get('/delete', faqController.delete);
module.exports = router;
