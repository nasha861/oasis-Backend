const mongoose = require('mongoose');

const installationSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    }, 
   systemPackage: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SystemPackage',
        required: true
    },
    technicians: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
    }],
    geoCoordinates: {
    lat: Number,
    lng: Number
    },
    status: {
        type: String,
        enum:['survey','pending', 'in-progress', 'completed'],
        default: 'survey'
    },
    
    installationDate: Date,
    
    address: {type: String},
    note: String
    }, { timestamps: true });

    module.exports = mongoose.model('Installation', installationSchema);
    
