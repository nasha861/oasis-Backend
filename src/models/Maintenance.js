const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
    installation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Installation',
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician',
        required: true 
    },
    type: {
    type: String,
    enum: ['routine', 'repair', 'emergency'],
    required:true
    },
    status: {
         type: String, 
         enum: ['scheduled', 'pending', 'in-progress', 'completed'],
         default: 'scheduled'}
    ,
    scheduledDate: Date,
    completionNotes: String,
}, {timestamps: true});
    


module.exports = mongoose.model('Maintenance', MaintenanceSchema);