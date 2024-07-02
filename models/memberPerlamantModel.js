const mongoose = require('mongoose');

const memberPerlamantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    image: {
        type: String,
        required: true
    },
    cover_image: {
        type: String,
        required: true
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
    zip: {
        type: String,
        required: true
    },
    political_affiliation: {
        type: String,
        required: true
    },
    constituency: {
        type: String,
        required: true
    },
    perferred_language: {
        type: String,
        required: true
    },
    contact_email: {
        type: String,
        required: true
    },
    contact_website: {
        type: String,
        required: true
    },
    hill_office_house_of_commons: {
        type: String,
        required: true
    },
    hill_office_telephone: {
        type: String,
    },
    hill_office_fax: {
        type: String,
    },
    constituency_office_main_office: {
        type: String,
        required: true
    },
    constituency_telephone: {
        type: String,
    },
    constituency_fax: {
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

module.exports = mongoose.model("MemberPerlamant", memberPerlamantSchema);