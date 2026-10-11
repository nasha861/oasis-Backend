const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: [String],
      default: [],
    },
    homeowner: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Quote", quoteSchema);