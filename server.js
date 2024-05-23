const express=require('express')
const cors=require('cors')
const morgan=require('morgan')
const dotenv=require('dotenv')
const connectDb = require('./config/db')
const bodyParser = require('body-parser');


// dot en configuration
dotenv.config()

// DB connection 
connectDb()


// rest object 
const app =express()

app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

// middleware

app.use(cors())
app.use(express.json())



// using morgan we can see all router hit information in console terminal
app.use(morgan("dev"))


// route
// url=>http://localhost:8080

app.use("/api/v1/test",require("./routes/testRoute"))
app.use("/api/v1/auth",require("./routes/authRoutes"))
app.use("/api/v1/package",require("./routes/packageRoutes"))
app.use("/api/v1/payment",require("./routes/paymentRoutes"))
// job
app.use("/api/v1/job",require("./routes/jobRoutes"))
//category
app.use("/api/v1/category",require("./routes/categoryRoutes"))
//sub category
app.use("/api/v1/subcategory",require("./routes/subCategoryRoutes"))
//business post
app.use("/api/v1/business-post",require("./routes/businessPostRoutes"))
//country
app.use("/api/v1/country",require("./routes/countryRoutes"))
//state
app.use("/api/v1/state",require("./routes/stateRoutes"))
//city
app.use("/api/v1/city",require("./routes/cityRoutes"))
app.use("/api/v1/faq",require("./routes/settingRoutes"))

//slot
app.use("/api/v1/slot",require("./routes/slotRoutes"))
//reservation
app.use("/api/v1/reservation",require("./routes/reservationRoutes"))
//member of perlamant
app.use("/api/v1/member-of-perlamant",require("./routes/memberPerlamantRoutes"))
//user profile
app.use("/api/v1/user-profile",require("./routes/profileRoutes"))


app.get("/",(req,res)=>{
    return res.status(200).send("<h1> Welcome to turk compass server app </h1>")
})

// app info
app.use("/api/v1/app-info",require("./routes/appInfoRoute"))
// app info

// App Event
app.use("/api/v1/event",require("./routes/eventRoute"))
// App Event

// user 
app.use("/api/v1/user",require("./routes/authRoutes"))
// user 

// port 
const PORT=process.env.PORT || 8080;

//LISTEN
app.listen(PORT, ()=>{
        console.log(`server  running on ${PORT}`)
})