const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    name_tr: {
        type: String,
        required: [true, 'Name (Turkish) is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'category is required']
    },
    image: {
        type: String,
        required: false
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

module.exports = mongoose.model("Tag", tagSchema);