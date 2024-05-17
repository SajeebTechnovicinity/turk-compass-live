const mongoose = require('mongoose');
const appInfoSchema = new mongoose.Schema({
    about_us: {
        type: String,
    },
    terms_condition:{
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
module.exports = mongoose.model("AppInfo", appInfoSchema);