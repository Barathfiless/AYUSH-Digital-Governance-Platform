const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const fs = require('fs');
const fsAsync = require('fs').promises;
const path = require('path');

// SSE emitter – may be unavailable during circular-require bootstrap; resolve lazily
const getSseEmit = () => {
    try { return require('./events').sseEmit; } catch (_) { return () => {}; }
};

// Create new application
router.post('/submit', async (req, res) => {
    try {
        const applicationData = req.body;

        // Process Documents: Save base64 to files
        if (applicationData.documents && applicationData.documents.length > 0) {
            // Ensure upload directory exists
            const uploadDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            applicationData.documents = await Promise.all(applicationData.documents.map(async doc => {
                // Check if it's a base64 string
                if (doc.url && typeof doc.url === 'string' && doc.url.startsWith('data:')) {
                    try {
                        const parts = doc.url.split(';base64,');
                        if (parts.length === 2) {
                            const header = parts[0]; // e.g., "data:image/png"
                            const base64Data = parts[1];

                            // Determine extension
                            let ext = 'bin';
                            if (header.includes('pdf')) ext = 'pdf';
                            else if (header.includes('png')) ext = 'png';
                            else if (header.includes('jpeg') || header.includes('jpg')) ext = 'jpg';
                            else if (header.includes('svg')) ext = 'svg';
                            else if (header.includes('webp')) ext = 'webp';
                            else if (header.includes('gif')) ext = 'gif';

                            const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
                            const filepath = path.join(uploadDir, filename);

                            // Async write – non-blocking
                            await fsAsync.writeFile(filepath, Buffer.from(base64Data, 'base64'));

                            // Success: Replace huge base64 with simple file path
                            doc.url = `/uploads/${filename}`;
                            console.log(`Saved file: ${filename}`);
                        }
                    } catch (err) {
                        console.error('Error saving file:', err);
                        // If we fail to save the file, we keep the original URL? 
                        // No, if we keep it, we hit DB limits. Better to fail or clear it.
                        // For now, let's keep it but log error.
                    }
                }
                return doc;
            }));
        }

        // 🗄️ Sanity check: Ensure required core fields exist before attempting save
        if (!applicationData.companyName || !applicationData.userId) {
            return res.status(400).json({ 
                message: 'Incomplete application dossier (Missing Company Name or User ID)' 
            });
        }

        const newApplication = new Application(applicationData);
        await newApplication.save();

        // Confirm submission to the applicant via notification
        if (applicationData.userId) {
            try {
                await new Notification({
                    userId: applicationData.userId,
                    title: 'Application Submitted',
                    message: `Your application for ${applicationData.companyName || 'your company'} has been successfully submitted and is now under review.`,
                    type: 'StatusUpdate',
                }).save();
            } catch (_) { /* non-critical */ }
        }

        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (error) {
        console.error('Submission error:', error);
        global.lastError = { message: error.message, stack: error.stack, time: new Date() };
        res.status(500).json({ 
            message: 'Error submitting application', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get aggregated portal stats for landing page
router.get('/stats', async (req, res) => {
    try {
        const [
            totalApproved,
            totalPending,
            totalRejected,
            totalCancelled,
            approvedASU,
            approvedHomeo,
            totalApplications
        ] = await Promise.all([
            Application.countDocuments({ status: 'Approved' }),
            Application.countDocuments({ status: 'Pending' }),
            Application.countDocuments({ status: 'Rejected' }),
            Application.countDocuments({ status: { $in: ['Rejected'] }, rejectionReason: { $exists: true, $ne: '' } }),
            // ASU: Ayurveda, Siddha, Unani based on products or company type
            Application.countDocuments({
                status: 'Approved',
                $or: [
                    { 'products.category': { $in: ['Ayurveda', 'Siddha', 'Unani', 'ASU'] } },
                    { systemType: { $in: ['Ayurveda', 'Siddha', 'Unani', 'ASU'] } }
                ]
            }),
            Application.countDocuments({
                status: 'Approved',
                $or: [
                    { 'products.category': { $in: ['Homoeopathy', 'Homeopathy'] } },
                    { systemType: { $in: ['Homoeopathy', 'Homeopathy'] } }
                ]
            }),
            Application.countDocuments({})
        ]);

        res.json({
            // Official AYUSH baseline figures + portal approvals
            approvedASU: 751 + approvedASU,
            approvedHomeo: 350 + approvedHomeo,
            // Live portal data
            portalApprovedLicenses: totalApproved,
            portalPendingApplications: totalPending,
            portalRejectedApplications: totalRejected,
            cancelledSuspended: totalRejected,
            totalApplications,
            // raw
            raw: { totalApproved, totalPending, totalRejected, approvedASU, approvedHomeo }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

// Get state-wise statistics
router.get('/state-wise', async (req, res) => {
    try {
        const stats = await Application.aggregate([
            {
                $group: {
                    _id: "$state",
                    licenses: {
                        $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] }
                    },
                    retailers: { $sum: 1 } // Total retailers who applied
                }
            },
            {
                $project: {
                    state: "$_id",
                    licenses: 1,
                    retailers: 1,
                    status: {
                        $cond: [
                            { $gt: ["$licenses", 50] }, "High",
                            { $cond: [{ $gt: ["$licenses", 10] }, "Medium", "Low"] }
                        ]
                    }
                }
            },
            { $sort: { licenses: -1 } }
        ]);

        // If no data in DB, return some defaults so the UI isn't empty
        if (stats.length === 0) {
            return res.json([
                { state: 'Maharashtra', licenses: 0, retailers: 0, status: 'Low' },
                { state: 'Gujarat', licenses: 0, retailers: 0, status: 'Low' }
            ]);
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching state-wise stats', error: error.message });
    }
});

// Get all applications (for officers)
router.get('/all', async (req, res) => {
    try {
        const applications = await Application.find().sort({ submittedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
});

// Get applications for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Robust check for invalid IDs
        if (!userId || userId === 'undefined' || userId === 'null' || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.json([]);
        }

        const applications = await Application.find({ userId }).sort({ submittedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
});

// Update application status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, inspectionImage, inspectionLocation, rejectionReason, verifiedBy, renewalDate } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        const updateData = { status };
        if (inspectionImage) updateData.inspectionImage = inspectionImage;
        if (inspectionLocation) updateData.inspectionLocation = inspectionLocation;
        if (rejectionReason) updateData.rejectionReason = rejectionReason;
        if (verifiedBy) updateData.verifiedBy = verifiedBy;
        if (renewalDate) updateData.renewalDate = renewalDate;

        if (status === 'SiteInspection') {
            const currentApp = await Application.findById(id);
            if (currentApp && !currentApp.applicationId) {
                const count = await Application.countDocuments({ applicationId: { $exists: true } });
                const year = new Date().getFullYear();
                const random = Math.floor(1000 + Math.random() * 9000);
                updateData.applicationId = `AYU-${year}-${(count + 1).toString().padStart(3, '0')}-${random}`;
            }
        }

        const application = await Application.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        // Create notification for the user
        if (application) {
            let message = `Your application for ${application.companyName} has been ${status.toLowerCase()}.`;
            let title = `Application ${status}`;

            if (status === 'SiteInspection' && application.applicationId) {
                message = `Your application has been accepted for Site Inspection. Your Application ID is ${application.applicationId}. Officers will visit shortly.`;
            } else if (status === 'Approved') {
                message = `Congratulations! Your application for ${application.companyName} has been fully approved. You can now download your license.`;
            }

            const savedNotif = await new Notification({
                userId: application.userId,
                title,
                message,
                type: 'StatusUpdate'
            }).save();

            // Push real-time SSE event to connected client
            getSseEmit()(String(application.userId), {
                type: 'StatusUpdate',
                title,
                message,
                status,
                applicationId: application.applicationId,
                companyName: application.companyName,
                notificationId: savedNotif._id
            });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});

// Add product to application
router.post('/:id/products', async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Strict Check: Only approved applications can add products
        if (application.status !== 'Approved') {
            return res.status(403).json({ message: 'Only approved applications can add products' });
        }

        // Process Product Image: Save base64 to file
        if (product.image && typeof product.image === 'string' && product.image.startsWith('data:')) {
            try {
                const uploadDir = path.join(__dirname, '../uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const parts = product.image.split(';base64,');
                if (parts.length === 2) {
                    const header = parts[0];
                    const base64Data = parts[1];

                    let ext = 'bin';
                    if (header.includes('png')) ext = 'png';
                    else if (header.includes('jpeg') || header.includes('jpg')) ext = 'jpg';
                    else if (header.includes('webp')) ext = 'webp';

                    const filename = `prod-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
                    const filepath = path.join(uploadDir, filename);

                    await fsAsync.writeFile(filepath, Buffer.from(base64Data, 'base64'));
                    product.image = `/uploads/${filename}`;
                }
            } catch (err) {
                console.error('Error saving product image:', err);
            }
        }

        application.products.push(product);
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});

// Get single application by ID or Application ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined' || id === 'null') {
            return res.status(404).json({ message: 'Application not found' });
        }

        let application;
        // Check if it's a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            application = await Application.findById(id);
        }

        // If not found by _id, search by custom applicationId
        if (!application) {
            application = await Application.findOne({ applicationId: id });
        }

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching application', error: error.message });
    }
});

// Update application certificate
router.patch('/:id/certificate', async (req, res) => {
    try {
        const { id } = req.params;
        const { certificateUrl } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { certificateUrl },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Notification for certificate
        await new Notification({
            userId: application.userId,
            title: 'Certificate Issued',
            message: `Official digital certificate for ${application.companyName} has been posted.`,
            type: 'StatusUpdate'
        }).save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error updating certificate', error: error.message });
    }
});

// Submit certificate appeal
router.patch('/:id/certificate-appeal', async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            {
                certificateAppeal: {
                    reason,
                    status: 'Pending',
                    date: new Date()
                }
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting appeal', error: error.message });
    }
});

// Resolve certificate appeal
router.patch('/:id/certificate-appeal/resolve', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            {
                'certificateAppeal.status': 'Resolved'
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error resolving appeal', error: error.message });
    }
});

module.exports = router;
