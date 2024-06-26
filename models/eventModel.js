const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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
    is_payment_complete: {
        type: Boolean,
        required: false,
        default: 0
    },
    payment_date: {
        type: String,
        required: false,
        default: null
    },
    payment_amount: {
        type: Number,
        required: false,
        default: 0
    },
    payment_method: {
        type: String,
        required: false,
        default: null
    },
    tnx_number: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: Number,
        default: 1,
        enum: [0, 1],
    },
    is_delete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);