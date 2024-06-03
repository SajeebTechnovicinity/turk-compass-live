const mongoose = require('mongoose');

const businessPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sub_category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    business_name: {
        type: String,
        required: [true, 'Name is required']
    },
    tag: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag' // Reference to the Tag model
    }],
    description: {
        type: String,
        required: false
    },
    speciality: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    cover_image: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    contact_address: {
        type: String,
        required: false
    },
    contact_email: {
        type: String,
        required: false
    },
    contact_located_in: {
        type: String,
        required: false
    },
    contact_phone: {
        type: String,
        required: false
    },
    contact_website: {
        type: String,
        required: false
    },
    is_reservation_available: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    is_multiple_reservation_available: {
        type: Number,
        default: 0,
        enum: [0, 1]
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

module.exports = mongoose.model("BusinessPost", businessPostSchema);