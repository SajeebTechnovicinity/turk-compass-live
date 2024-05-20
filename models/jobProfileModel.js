const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    summary: {
        type: String,
    },
    work_history: {
        type: [{
            designation: String,
            company: String,
            start_date:String,
            end_date:String,

        }],
        default: []
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
        required: [true, 'skill is required']
    },
    benefit: {
        type: String,
    },
    salary:{
        type: String,
    },
    requirement: {
        type: String,
        required: [true, 'requirement is required'],
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
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);