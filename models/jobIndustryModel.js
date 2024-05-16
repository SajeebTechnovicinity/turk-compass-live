const mongoose = require('mongoose');
const jobIndustrySchema = new mongoose.Schema({
    title: {
        type:String,
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

module.exports = mongoose.model("JobIndustry", jobIndustrySchema);