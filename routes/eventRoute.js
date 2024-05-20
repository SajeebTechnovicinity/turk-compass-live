const express= require('express');
const eventController = require('../controllers/eventController');
const router=express.Router();

router.post('/edit-create-event',eventController.eventEditCreate);
router.get('/get-event',eventController.getEvent);
module.exports=router