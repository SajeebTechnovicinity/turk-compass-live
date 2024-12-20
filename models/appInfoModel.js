const mongoose = require('mongoose');
const appInfoSchema = new mongoose.Schema({
    about_us: {
        type: String,
        require:false
    },
    terms_condition:{
        type: String,
        require:false
    },
    privacy_policy:{
        type: String,
        require:false
    },
    home_banner:{
        type: {
            offer_name: String,
            title: String,
            image: String,
            link:String,
        },
        default: {}
    },
    consulate_info:{
        type: String,
        require:false
    },
    consulate_img:{
        type: String,
        require:false
    },
    consulate_cover_img:{
        type: String,
        require:false
    },
    is_google_email: {
        type: Number,
        default: 1,
        enum: [0, 1]
    },
    amount: {
        type: Number,
        default: 100
    },
    ads_price: {
        type: Number,
        default: 10
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