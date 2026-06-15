const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const rateLimit = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

// Basic remote debugging for 500s
global.lastError = null;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Payload-too-large handler (must come right after body parsers)
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ message: 'Payload too large (Server Limit)' });
    }
    next(err);
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',          rateLimit(15, 100), require('./routes/auth'));
app.use('/api/applications',  require('./routes/application'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/sentiment',     require('./routes/sentiment'));
app.use('/api/rag',           require('./routes/rag'));
app.use('/api/reviews',       require('./routes/review'));
app.use('/api/loans',         require('./routes/loans'));
app.use('/api/acts',          require('./routes/acts'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/verify',        require('./routes/verify'));

// SSE real-time events
const { router: eventsRouter } = require('./routes/events');
app.use('/api/events', eventsRouter);

// ── Health & Root ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.sendFile(path.join(__dirname, '../Client/dist/index.html'));
    }
    res.send('AYUSH Gateway API is running');
});

app.get('/health', (req, res) => {
    res.json({
        server: 'online',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// ── Serve Frontend in Production ──────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../Client/dist')));
    
    // Wildcard route to serve the React app index.html for client-side routing
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, '../Client/dist/index.html'));
        } else {
            res.status(404).json({ message: 'API Route Not Found' });
        }
    });
}

// ── Start Server ─────────────────────────────────────────────────────────────
const start = async () => {
    try {
        await connectDB();
        console.log(`Connected to Database: ${mongoose.connection.db.databaseName}`);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

start();
