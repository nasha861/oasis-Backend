const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    installation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Installation',
      required: true
    },
    energySavings: {
      type: Number,
      min: 0
    },
    summary: {
      type: String,
      required: true
    },
    results: String,
    images: [String],
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
