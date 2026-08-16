const mongoose = require('mongoose');

const solarProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    modelName: {
      type: String,
      trim: true,
      required: true
    },
    manufacturer: {
      type: String,
      trim: true,
      required: true
    },
    category: {
      type: String,
      enum: ['panel', 'inverter', 'battery', 'racking'],
      required: true
    },
    wattage: Number,
    warrantyYears: Number,
    price: Number,
    specifications: {
      efficiency: Number,
      capacity: Number,
      voltage: Number,
      notes: String
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SolarProduct', solarProductSchema);
