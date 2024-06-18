const mongoose = require('mongoose');
const faqSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description:{
        type: String,
        required: [true, 'Description is required']
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
module.exports = mongoose.model("faq", faqSchema);