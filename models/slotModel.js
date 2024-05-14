const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    business_post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    amount_of_reservation: {
        type: Number,
        default:0
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

module.exports = mongoose.model("Slot", slotSchema);