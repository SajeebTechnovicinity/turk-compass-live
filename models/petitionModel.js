const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    link: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
      enum: [0, 1],
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Petition", petitionSchema);
