const mongoose = require('mongoose');

const consulttateSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    fax: {
        type: String,
    },
    email: {
        type: String,
    },
    web: {
        type: String,
    },
    opening_info: {
        type: [{
            opening_info: String,
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

module.exports = mongoose.model("ConsultateBranch", consulttateSchema);