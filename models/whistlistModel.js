const mongoose = require('mongoose');

const whishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    business_post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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

module.exports = mongoose.model("Whishlist", whishlistSchema);