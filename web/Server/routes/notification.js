const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// ── GET: notifications for a user ────────────────────────────────────────────
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(30);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
});

// ── GET: unread count only (lightweight) ─────────────────────────────────────
router.get('/unread-count/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.json({ count: 0 });
        }
        const count = await Notification.countDocuments({ userId, read: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching count', error: error.message });
    }
});

// ── POST: create a notification ───────────────────────────────────────────────
router.post('/create', async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;
        if (!userId || !title || !message) {
            return res.status(400).json({ message: 'userId, title, and message are required' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId' });
        }
        const notification = await new Notification({
            userId,
            title,
            message,
            type: type || 'StatusUpdate',
        }).save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notification', error: error.message });
    }
});

// ── PATCH: mark one as read ───────────────────────────────────────────────────
router.patch('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { read: true });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
});

// ── PATCH: mark all as read ───────────────────────────────────────────────────
router.patch('/user/:userId/read-all', async (req, res) => {
    try {
        const { userId } = req.params;
        await Notification.updateMany({ userId, read: false }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notifications', error: error.message });
    }
});

// ── DELETE: dismiss (delete) a single notification ───────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        await Notification.findByIdAndDelete(id);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notification', error: error.message });
    }
});

module.exports = router;
