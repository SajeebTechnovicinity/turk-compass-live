const mongoose = require('mongoose');

const jobApplySchema = new mongoose.Schema({
    // job_id,cv,cover_letter
    cv:{
    type: String,
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
        type: String,
        required: [true, 'apply_by is required']
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