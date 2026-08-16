const mongoose =require('mongoose');

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country:{
        type: String,
        default: 'Nigeria'
    }
},
{ _id:false }
);

const customerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    billingAddress: addressSchema,
    phoneNumber: {
        type: String,
        trim: true
    },
    accountStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {timestamps: true});

module.exports = mongoose.model('Customer', customerSchema);