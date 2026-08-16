const mongoose = require('mongoose');

const systemPackageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
    trim: true,
    unique: true // prevents duplicate package names
  },

  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedOutput: {
    type: Number,
    required: true,
    min: 0 // kWh/day
  },

  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SolarProduct',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  description: String,
    isActive: {
        type: Boolean,
        default: true
    }
  
}, { timestamps: true });

module.exports = mongoose.model('SystemPackage', systemPackageSchema);
