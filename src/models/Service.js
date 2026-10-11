const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      enum: [
        'installation',
        'maintenance',
        'consultation',
        'repair',
        'inspection',
        'other'
      ],
      required: true
    },

    price: {
      type: Number,
      min: 0,
      default: 0
    },

    duration: {
      type: String,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Service', serviceSchema);