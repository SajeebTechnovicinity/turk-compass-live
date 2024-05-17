const mongoose = require('mongoose');

const dslotSchema = new mongoose.Schema({
    business_post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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

module.exports = mongoose.model("DurationSlot", dslotSchema);