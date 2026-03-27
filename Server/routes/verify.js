const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// ── GET /api/verify/license/:id ──────────────────────────────────────────────
// Publicly accessible verification page for checking license authenticity
router.get('/license/:id', async (req, res) => {
    try {
        // Find by either MongoDB _id or the human-readable license (applicationId)
        const application = await Application.findOne({
            $or: [
                { _id: req.params.id.length === 24 ? req.params.id : null },
                { applicationId: req.params.id }
            ],
            status: 'Approved'
        }).select('companyName applicationId renewalDate state founderName certificateIssueDate certificateUrl').lean();

        if (!application) {
            return res.status(404).json({ 
                success: false, 
                message: 'No valid verified license found for this ID' 
            });
        }

        const now = new Date();
        const renewal = new Date(application.renewalDate);
        const isActive = renewal > now;

        res.json({
            success: true,
            isValid: isActive,
            data: {
                companyName: application.companyName,
                licenseNumber: application.applicationId,
                validUntil: application.renewalDate,
                issueDate: application.certificateIssueDate || '2024-03-27',
                state: application.state,
                founder: application.founderName,
                status: isActive ? 'ACTIVE / VALID' : 'EXPIRED',
                verificationStamp: 'Verified by Ministry of Ayush Digital Gateway (e-Ayush)'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Verification error' });
    }
});

module.exports = router;
