const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const User = require('../models/User');

// ── GET /api/admin/analytics ────────────────────────────────────────────────
// Returns aggregated statistics for the admin analytics dashboard
router.get('/analytics', async (req, res) => {
    try {
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const [statusBreakdown, monthlyTrend, stateWise, topCategories, renewalAlerts, totalUsers] = await Promise.all([
            // Status breakdown
            Application.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),

            // Monthly application trend (last 6 months)
            Application.aggregate([
                { $match: { submittedAt: { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$submittedAt' },
                            month: { $month: '$submittedAt' }
                        },
                        submitted: { $sum: 1 },
                        approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
                        rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $let: {
                                vars: {
                                    months: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                                },
                                in: { $arrayElemAt: ['$$months', '$_id.month'] }
                            }
                        },
                        submitted: 1,
                        approved: 1,
                        rejected: 1
                    }
                }
            ]),

            // State-wise distribution
            Application.aggregate([
                { $group: { _id: '$state', total: { $sum: 1 }, approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } } } },
                { $sort: { total: -1 } },
                { $limit: 10 }
            ]),

            // Top product categories from approved applications
            Application.aggregate([
                { $match: { status: 'Approved' } },
                { $unwind: '$products' },
                { $group: { _id: '$products.category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 6 }
            ]),

            // Renewal alerts — licenses expiring in next 30 days
            Application.find({
                status: 'Approved',
                renewalDate: {
                    $gte: now,
                    $lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                }
            }).select('companyName applicationId renewalDate state').lean(),

            // Total registered users
            User.countDocuments({})
        ]);

        const statusMap = {};
        statusBreakdown.forEach(s => { statusMap[s._id] = s.count; });

        const totalApps = Object.values(statusMap).reduce((a, b) => a + b, 0);
        const approvalRate = totalApps > 0 ? Math.round((statusMap['Approved'] || 0) / totalApps * 100) : 0;

        res.json({
            summary: {
                totalApplications: totalApps,
                totalUsers,
                approvalRate,
                pending: statusMap['Pending'] || 0,
                approved: statusMap['Approved'] || 0,
                rejected: statusMap['Rejected'] || 0,
                siteInspection: statusMap['SiteInspection'] || 0,
            },
            monthlyTrend,
            stateWise: stateWise.map(s => ({ state: s._id, total: s.total, approved: s.approved })),
            topCategories: topCategories.map(c => ({ category: c._id, count: c.count })),
            renewalAlerts: renewalAlerts.map(a => ({
                companyName: a.companyName,
                applicationId: a.applicationId,
                renewalDate: a.renewalDate,
                state: a.state,
                daysLeft: Math.ceil((new Date(a.renewalDate) - now) / (1000 * 60 * 60 * 24))
            }))
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
});

// ── GET /api/admin/users ─────────────────────────────────────────────────────
// Paginated user listing for admin panel
router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const role = req.query.role || '';

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) query.role = role;

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments(query)
        ]);

        res.json({
            users,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// ── GET /api/admin/renewal-alerts ────────────────────────────────────────────
// Returns all licenses expiring within the next N days
router.get('/renewal-alerts', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const now = new Date();
        const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        const alerts = await Application.find({
            status: 'Approved',
            renewalDate: { $gte: now, $lte: future }
        })
            .select('companyName applicationId renewalDate state founderEmail founderName')
            .sort({ renewalDate: 1 })
            .lean();

        res.json(alerts.map(a => ({
            ...a,
            daysLeft: Math.ceil((new Date(a.renewalDate) - now) / (1000 * 60 * 60 * 24))
        })));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching renewal alerts', error: error.message });
    }
});

// ── POST /api/admin/verify-application ──────────────────────────────────────
// AI-powered pre-check: validates fields and returns a completeness score
router.post('/verify-application/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const app = await Application.findById(id).lean();
        if (!app) return res.status(404).json({ message: 'Application not found' });

        const issues = [];
        let score = 100;

        // Field validations
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const aadharRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

        if (!gstinRegex.test(app.gstin || '')) {
            issues.push({ field: 'gstin', severity: 'high', message: 'GSTIN format is invalid' });
            score -= 20;
        }
        if (!panRegex.test(app.panNumber || '')) {
            issues.push({ field: 'panNumber', severity: 'high', message: 'PAN number format is invalid' });
            score -= 20;
        }
        const cleanAadhar = (app.aadharNumber || '').replace(/\s/g, '');
        if (cleanAadhar.length !== 12 || !/^\d+$/.test(cleanAadhar)) {
            issues.push({ field: 'aadharNumber', severity: 'high', message: 'Aadhar number must be 12 digits' });
            score -= 15;
        }
        if (!ifscRegex.test(app.ifscCode || '')) {
            issues.push({ field: 'ifscCode', severity: 'medium', message: 'IFSC code format is invalid' });
            score -= 10;
        }

        // Document checks
        const requiredDocs = [
            'Drug License',
            'GST Certificate',
            'Company Registration Certificate',
            "Owner's passport size photo",
            'Company photo'
        ];
        const uploadedTitles = (app.documents || []).map(d => d.title);
        requiredDocs.forEach(doc => {
            if (!uploadedTitles.some(t => t.toLowerCase().includes(doc.toLowerCase()))) {
                issues.push({ field: 'documents', severity: 'medium', message: `Missing document: ${doc}` });
                score -= 5;
            }
        });

        // Products check
        if (!app.products || app.products.length === 0) {
            issues.push({ field: 'products', severity: 'low', message: 'No products listed (can be added after approval)' });
            score -= 5;
        }

        // Incorporation date sanity check
        if (app.incorporationDate) {
            const incDate = new Date(app.incorporationDate);
            const yearsOld = (Date.now() - incDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
            if (yearsOld < 0) {
                issues.push({ field: 'incorporationDate', severity: 'high', message: 'Incorporation date is in the future' });
                score -= 15;
            }
        }

        const finalScore = Math.max(0, score);
        const recommendation = finalScore >= 80 ? 'Approve for Site Inspection'
            : finalScore >= 50 ? 'Request Clarification'
                : 'Flag for Rejection Review';

        res.json({
            score: finalScore,
            issues,
            recommendation,
            issueCount: { high: issues.filter(i => i.severity === 'high').length, medium: issues.filter(i => i.severity === 'medium').length, low: issues.filter(i => i.severity === 'low').length }
        });
    } catch (error) {
        res.status(500).json({ message: 'Verification error', error: error.message });
    }
});

// ── POST /api/admin/generate-certificate/:id ────────────────────────────────
// Automatically generates the internal verification URL for an approved startup
router.post('/generate-certificate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const app = await Application.findById(id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        if (app.status !== 'Approved') return res.status(400).json({ message: 'Can only generate for Approved status' });

        // Internal verification link is the "digital certificate"
        const certUrl = `/verify/license/${app.applicationId || app._id}`;
        
        app.certificateUrl = certUrl;
        app.certificateIssueDate = new Date();
        await app.save();

        res.json({ success: true, certificateUrl: certUrl });
    } catch (error) {
        res.status(500).json({ message: 'Generation error', error: error.message });
    }
});

// ── GET /api/admin/debug-error ───────────────────────────────────────────────
// Remote debugging: see the last server error without terminal access
router.get('/debug-error', (req, res) => {
    res.json(global.lastError || { message: 'No errors logged' });
});

module.exports = router;
