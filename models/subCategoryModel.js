const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    image: {
        type: String,
        required: false
    },
    business_post_count: {
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

module.exports = mongoose.model("SubCategory", subCategorySchema);