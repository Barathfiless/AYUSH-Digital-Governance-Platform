const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schemeId: { type: String, required: true },
    schemeName: { type: String, required: true },
    provider: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    aadhar: { type: String, required: true },
    pan: { type: String, required: true },
    amount: { type: Number, required: true },
    message: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    rejectionReason: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);
