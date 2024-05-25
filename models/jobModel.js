const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    description: {
        type: String,
    },
    salary_type:{
        type: String,
    },
    job_industry: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'description is required']
    },
    job_title:{
        type: String,
    },
    job_country:{
        type: mongoose.Schema.Types.ObjectId,
    },
    job_city:{
        type: mongoose.Schema.Types.ObjectId,
    },
    job_state:{
        type: mongoose.Schema.Types.ObjectId,
    },
    job_type:{
        type: String,
        required: [true, 'description is required']
    },
    candidate_require:{
        type: String,
    },
    location:{
        type: String,
    },
    skill: {
        type: String,
    },
    benefit: {
        type: String,
    },
    salary:{
        type: String,
    },
    requirement: {
        type: String,
    },
    question: {
        type: [{
            name: String,
            options: []
        }],
        default: []
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
},{ timestamps: true });

module.exports = mongoose.model("Job", jobSchema);