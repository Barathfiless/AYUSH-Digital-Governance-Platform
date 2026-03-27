const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    strength: { type: String, required: true },
    price: { type: String },
    description: { type: String },
    quantity: { type: String },
    image: { type: String }
});

const ApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    gstin: { type: String, required: true },
    panNumber: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    drugLicenseNumber: { type: String },
    incorporationDate: { type: Date, required: true },
    founderName: { type: String, required: true },
    founderEmail: { type: String, required: true },
    employeeCount: { type: String, required: true },
    products: [ProductSchema],
    documents: [{
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String }
    }],
    registeredAddress: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    fundingStage: { type: String },
    annualRevenue: { type: String },
    status: { type: String, enum: ['Pending', 'SiteInspection', 'Approved', 'Rejected'], default: 'Pending' },
    applicationId: { type: String, unique: true, sparse: true },
    siteInspectionReport: { type: String },
    inspectionImage: { type: String },
    inspectionLocation: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String }
    },
    rejectionReason: { type: String },
    verifiedBy: { type: String },
    renewalDate: { type: Date },
    certificateUrl: { type: String },
    certificateIssueDate: { type: Date },
    verificationQrUrl: { type: String },
    certificateAppeal: {
        reason: { type: String },
        status: { type: String, enum: ['Pending', 'Resolved'] },
        date: { type: Date }
    },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
