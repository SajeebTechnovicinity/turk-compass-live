const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const dotenv = require('dotenv');
const connectDb = require('./config/db');
const routes = require('./routes'); // Import the routes

// dotenv configuration
// dotenv.config();
// DB connection
connectDb();
// Create an instance of express
const app = express();

// Middleware
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use(cors());
app.use(morgan("dev"));

// Use routes
app.use("/api/v1", routes);


app.get('/success', (req, res) => {
    res.send('Payment was successful.');
});

app.get('/cancel', (req, res) => {
    res.send('Payment was cancelled.');
});
// Port
const PORT = process.env.PORT || 8080;
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});