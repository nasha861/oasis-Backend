const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            trim: true, 
            required: true
        },
        slug: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        status:{
            type: String,
            enum: ['draft', 'published'],
            default: 'draft'
        },
        publishedAt: Date
    },
    { timestamps: true }
);
module.exports =mongoose.model('Blog', blogSchema);  