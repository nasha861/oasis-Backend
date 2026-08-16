const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
  certifications: [String],

    phone: String,

  specialization: {
    type: String,
    enum: ["installation", "maintenance", "both"],
    default: "both",
  },

  assignedInstallations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Installation",
    },
  ],

  assignedMaintenance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maintenance",
    },
  ],

  status: {
    type: String,
    enum: ["available", "busy", "inactive"],
    default: "available",
  },

  currentLocation: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

module.exports = mongoose.model("Technician", technicianSchema);