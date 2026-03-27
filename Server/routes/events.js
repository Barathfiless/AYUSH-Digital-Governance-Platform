/**
 * Server-Sent Events (SSE) route for real-time push notifications.
 * Clients connect once; server pushes events without polling.
 *
 * Usage:
 *   Client: const es = new EventSource(`/api/events/stream?userId=<id>`)
 *   Server: sseEmit(userId, { type: 'StatusUpdate', payload: {...} })
 */

const express = require('express');
const router = express.Router();

// In-memory connection store: userId -> Set of response objects
const clients = new Map();

/**
 * Emit an SSE event to a specific user.
 * @param {string} userId
 * @param {object} data
 */
function sseEmit(userId, data) {
    const userClients = clients.get(String(userId));
    if (!userClients || userClients.size === 0) return;
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    userClients.forEach(res => {
        try { res.write(payload); } catch (_) { /* client disconnected */ }
    });
}

// ── GET /api/events/stream?userId=<id> ────────────────────────────────────────
router.get('/stream', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'userId query param required' });
    }

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
    res.flushHeaders();

    // Register client
    if (!clients.has(userId)) clients.set(userId, new Set());
    clients.get(userId).add(res);

    // Heartbeat every 25s to keep connection alive
    const heartbeat = setInterval(() => {
        try { res.write(': heartbeat\n\n'); } catch (_) { clearInterval(heartbeat); }
    }, 25000);

    // Send welcome event
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE stream active' })}\n\n`);

    // Cleanup on disconnect
    req.on('close', () => {
        clearInterval(heartbeat);
        const set = clients.get(userId);
        if (set) {
            set.delete(res);
            if (set.size === 0) clients.delete(userId);
        }
    });
});

// ── GET /api/events/connections ───────────────────────────────────────────────
// Health check for admin: how many live connections
router.get('/connections', (req, res) => {
    let total = 0;
    clients.forEach(set => { total += set.size; });
    res.json({ activeConnections: total, uniqueUsers: clients.size });
});

module.exports = { router, sseEmit };
