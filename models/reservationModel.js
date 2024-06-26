const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    business_post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    slot_date: {
        type: String,
        required: false,
    },
    duration_slot: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    number_of_person: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        required: false,
    },
    is_canceled: {
        type: Number,
        default: 0, // 0 --> not canceled, 1 --> calceled
        enum: [0, 1]
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

module.exports = mongoose.model("Reservation", reservationSchema);