const mongoose = require('mongoose');

const jobApplySchema = new mongoose.Schema({
    // job_id,cv,cover_letter
    cv_path:{
    type: String,
    required:false,
    },
    cover_letter: {
        type: String,
        required: [true, 'coveretter is required']
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    apply_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    job_profile: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    job_status:{
        type: Number,
        default: 0,
        enum: [0, 1],  // The allowed values for job_status are 0=not shot_list and 1=short List
    },
    question_ans:{
        type: [{
            question: String,
            ans:String
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

module.exports = mongoose.model("JobApply", jobApplySchema);