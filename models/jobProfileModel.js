const mongoose = require('mongoose');

const jobProfileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    gender:{
        type: String,
    },
    photo:{
        type: String, 
    },
    name:{
        type: String,
    },
    total_experience:{
        type: Number,
    },
    expart:{
        type: String,
    },
    addition_info:{
        type: String,
    },
    phone:{
        type: String,
    },
    email:{
        type: String, 
    },
    country:{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    city:{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    state:{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    summary: {
        type: String,
    },
    work_history: {
        type: [{
            designation: String,
            company: String,
            responsibility: String,
            start_date:String,
            end_date:String,
            total_experience:String
        }],
        default: []
    },

    education: {
        type: [{
            degree: String,
            institute_name: String,
            start_date:String,
            end_date:String,
        }],
        default: []
    },
    skill:{
        type: [],
        default: []
    },
    language:{
        type: [],
        default: []
    },
    eligibility:{
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    defalut_cv:{
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

module.exports = mongoose.model("JobProfile", jobProfileSchema);