const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, aadhar, pan, password, role } = req.body;

        // Check if user already exists
        // Check email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Check phone
        user = await User.findOne({ phone });
        if (user) {
            return res.status(400).json({ success: false, message: 'User with this phone number already exists' });
        }

        // Check aadhar (only if provided)
        if (aadhar) {
            user = await User.findOne({ aadhar });
            if (user) {
                return res.status(400).json({ success: false, message: 'User with this Aadhar number already exists' });
            }
        }

        // Check PAN (only if provided)
        if (pan) {
            user = await User.findOne({ pan });
            if (user) {
                return res.status(400).json({ success: false, message: 'User with this PAN number already exists' });
            }
        }

        // Create new user
        user = await User.create({
            name,
            email,
            phone,
            aadhar,
            pan,
            password,
            role
        });

        // Send response with token
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                pan: user.pan,
                aadhar: user.aadhar
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ success: false, message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
        }

        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Create token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                pan: user.pan,
                aadhar: user.aadhar
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                pan: user.pan,
                aadhar: user.aadhar
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized' });
    }
});

module.exports = router;
