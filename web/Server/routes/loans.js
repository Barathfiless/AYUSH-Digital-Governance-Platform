const express = require('express');
const router = express.Router();
const LoanApplication = require('../models/LoanApplication');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify token and attach user
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized' });
    }
};

// Submit loan application
router.post('/submit', protect, async (req, res) => {
    try {
        const {
            schemeId,
            schemeName,
            provider,
            name,
            email,
            phone,
            aadhar,
            pan,
            amount,
            message
        } = req.body;

        const loanApp = await LoanApplication.create({
            userId: req.user.id,
            schemeId,
            schemeName,
            provider,
            companyName: name,
            email,
            phone,
            aadhar,
            pan,
            amount: parseFloat(amount),
            message,
            status: 'Pending'
        });

        res.status(201).json({ success: true, data: loanApp });
    } catch (error) {
        console.error('Submit loan error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all loan applications (for officers)
router.get('/all', protect, async (req, res) => {
    try {
        if (req.user.role !== 'officer' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized for this role' });
        }
        // In a real app, we'd check if user is an officer
        const applications = await LoanApplication.find().sort({ submittedAt: -1 });
        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update loan application status
router.put('/:id/status', protect, async (req, res) => {
    try {
        if (req.user.role !== 'officer' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized for this role' });
        }
        const { status, rejectionReason } = req.body;
        const loanApp = await LoanApplication.findByIdAndUpdate(
            req.params.id,
            {
                status,
                rejectionReason,
                reviewedBy: req.user.id,
                reviewedAt: Date.now()
            },
            { new: true }
        );

        if (!loanApp) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        res.status(200).json({ success: true, data: loanApp });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
