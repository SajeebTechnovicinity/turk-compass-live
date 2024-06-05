const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
//const requestLogger = require('./middleware/logger'); // Import the middleware

// middleware checks for all routes
router.use("/auth", require("./routes/authRoutes"));
//router.use(requestLogger);
// middleware checks for all routes

// router.use("/test", requestLogger, require("./routes/testRoute"));
// router.use("/auth", requestLogger, require("./routes/authRoutes"));


// Import route handlers
router.use("/test", require("./routes/testRoute"));
router.use("/package", require("./routes/packageRoutes"));
router.use("/payment", require("./routes/paymentRoutes"));
router.use("/job", require("./routes/jobRoutes"));
router.use("/category", require("./routes/categoryRoutes"));
router.use("/subcategory", require("./routes/subCategoryRoutes"));
router.use("/business-post", require("./routes/businessPostRoutes"));
router.use("/country", require("./routes/countryRoutes"));
router.use("/state", require("./routes/stateRoutes"));
router.use("/city", require("./routes/cityRoutes"));
router.use("/faq", require("./routes/settingRoutes"));
router.use("/consultate", require("./routes/settingRoutes"));
router.use("/slot", require("./routes/slotRoutes"));
router.use("/reservation", require("./routes/reservationRoutes"));
router.use("/member-of-perlamant", require("./routes/memberPerlamantRoutes"));
router.use("/user-profile", require("./routes/profileRoutes"));
router.use("/app-info", require("./routes/appInfoRoute"));
router.use("/event", require("./routes/eventRoute"));
router.use("/user", require("./routes/authRoutes"));
router.use("/whistlist", require("./routes/whishlistRoutes"));
router.use("/notification", require("./routes/notificationRoutes"));
router.use("/admin/dashboard", require("./routes/dashboardRoutes"));
router.use("/tag", require("./routes/tagRoutes"));
// Default route
router.get("/", (req, res) => {
    res.status(200).send("<h1> Welcome to Turk Compass server app </h1>");
});

module.exports = router;
