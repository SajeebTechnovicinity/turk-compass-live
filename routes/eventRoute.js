const express= require('express');
const eventController = require('../controllers/eventController');
const router=express.Router();

router.post('/edit-create-event',eventController.eventEditCreate);
router.get('/get-event',eventController.getEvent);
<<<<<<< HEAD
router.get("/get-event/date-wise", eventController.getEventDateWise);
=======
router.get('/get-event/date-wise',eventController.getEventDateMonth);
router.get('/get-event/all-in-month',eventController.getMonthEachDateEventList);

>>>>>>> 42b7cba52747e2f61ff4c0c73ff135f0790b57c0
module.exports=router