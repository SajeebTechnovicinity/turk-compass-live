const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    about_us:{
        type: String,
    },
    privacy_policy:{
        type: String,
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

module.exports = mongoose.model("Setting", settingSchema);