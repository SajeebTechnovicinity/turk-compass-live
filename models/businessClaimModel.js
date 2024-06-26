const mongoose = require('mongoose');

const businessClaimSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    business_post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    contact_name: {
        type: String,
        required: true
    },
    contact_phone: {
        type: String,
        required: true
    },
    contact_email: {
        type: String,
        required: true
    },
    business_name: {
        type: String,
        required: true
    },
    business_phone: {
        type: String,
        required: false
    },
    supporting_document: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    is_delete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("BusinessClaim", businessClaimSchema);