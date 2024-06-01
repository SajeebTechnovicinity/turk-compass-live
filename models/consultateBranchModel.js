const mongoose = require('mongoose');

const consulttateSchema = new mongoose.Schema({
    tite: {
        type: String,
        required: [true, 'Name is required']
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
    opening_info: {
        type: [{
            openint_ingo: String,
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