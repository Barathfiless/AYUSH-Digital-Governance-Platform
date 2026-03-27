const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Centralized JWT auth middleware.
 * Attaches req.user on success.
 */
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authorized – no token' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized – invalid token' });
    }
};

/**
 * Role-based guard. Must be used AFTER protect middleware.
 * @param  {...string} roles – allowed roles
 */
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: `Access denied. Requires one of: ${roles.join(', ')}` });
    }
    next();
};

module.exports = { protect, requireRole };
