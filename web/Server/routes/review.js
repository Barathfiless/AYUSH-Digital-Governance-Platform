const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const User = require('../models/User');

// ─────────────────────────────────────────────
// GET /api/reviews  — public, returns approved reviews
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const reviews = await Review.find({ approved: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        // Compute aggregate stats
        const all = await Review.find({ approved: true }).select('rating').lean();
        const totalRatings = all.length;
        const avgRating = totalRatings
            ? (all.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
            : 0;

        const distribution = [5, 4, 3, 2, 1].map(star => ({
            star,
            count: all.filter(r => r.rating === star).length
        }));

        res.json({ reviews, totalRatings, avgRating: parseFloat(avgRating), distribution });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
});

// ─────────────────────────────────────────────
// POST /api/reviews  — submit / update own review
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { userId, rating, review, userRole, userCompany } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        if (!review || review.trim().length < 10) {
            return res.status(400).json({ message: 'Review must be at least 10 characters' });
        }

        // Fetch user name from DB
        const user = await User.findById(userId).select('name').lean();
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Upsert: one review per user
        const saved = await Review.findOneAndUpdate(
            { userId },
            {
                userId,
                userName: user.name,
                userRole: userRole || '',
                userCompany: userCompany || '',
                rating,
                review: review.trim(),
                approved: true,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({ message: 'Review submitted successfully', data: saved });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting review', error: error.message });
    }
});

// ─────────────────────────────────────────────
// DELETE /api/reviews/:id  — delete own review
// ─────────────────────────────────────────────
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        await Review.findOneAndDelete({ userId });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
});

module.exports = router;
