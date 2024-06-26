const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    type: {
        type: String,
        enum: ["event", "subscription"],
        required: true,
      },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    payment_id: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        defaultValue:0,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);