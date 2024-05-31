const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    company: {
        type: String,
    },
    city_name:{
        type: String,
    },
    about_event:{
        type: String,
    },
    description:{
        type: String,
    },
    address:{
        type: String,
    },
    phone:{
        type: String,
    },
    website:{
        type: String,
    },
    banner:{
        type: String,
    },
    gallery:{
        type: [],
        default: []
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: Number,
        default: 1,
        enum: [0, 1]
    },
    is_delete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);