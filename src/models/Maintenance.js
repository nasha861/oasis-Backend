
const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({

    installation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Installation',
        required: true
    },

    // Admin assigns a technician after the customer submits the request
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician',
        required: false
    },

    // Maintenance package selected by the customer
    package: {
        type: String,
        enum: ['basic', 'advanced', 'premium'],
        required: true
    },

    type: {
        type: String,
        enum: ['routine', 'repair', 'emergency'],
        required: true
    },

    status: {
        type: String,
        enum: [
            'pending',
            'assigned',
            'scheduled',
            'in-progress',
            'completed',
            'cancelled'
        ],
        default: 'pending'
    },

    scheduledDate: Date,

    description: String,

    completionNotes: String

}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
