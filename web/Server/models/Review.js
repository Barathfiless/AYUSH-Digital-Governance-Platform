const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        default: ''
    },
    userCompany: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true,
        maxlength: 500
    },
    approved: {
        type: Boolean,
        default: true   // auto-approve; set false if you want moderation
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// One review per user
ReviewSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
