const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    offer_title: {
        type: String,
    },
     link: {
        type: String,
        required: true
    },
    cover_img: {
        type: String,
        required: true
    },
    payment_status: {
        type: Number,
        default: 0,
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

module.exports = mongoose.model("Banner", bannerSchema);