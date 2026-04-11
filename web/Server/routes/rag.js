/**
 * RAG Bridge - Node.js ↔ Python RAG Service
 * Uses built-in 'http' module — no extra dependencies needed.
 * Port: 5001 (Python RAG service)
 */

const express = require('express');
const router = express.Router();
const http = require('http');

const RAG_HOST = 'localhost';
const RAG_PORT = parseInt(process.env.RAG_PORT || '5001');

// ─── Core HTTP helper (replaces fetch/node-fetch) ──────────
function ragRequest(path, body = null, method = 'GET') {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const options = {
            hostname: RAG_HOST,
            port: RAG_PORT,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch { reject(new Error('Invalid JSON from RAG service')); }
            });
        });

        req.on('error', reject);
        req.setTimeout(20000, () => { req.destroy(); reject(new Error('RAG request timed out')); });

        if (payload) req.write(payload);
        req.end();
    });
}

const forwardToRAG = async (path, body, res) => {
    try {
        const data = await ragRequest(path, body, 'POST');
        res.json(data);
    } catch (err) {
        console.error(`RAG service error (${path}):`, err.message);
        res.status(503).json({ error: 'RAG service unavailable. Run: python Server/rag/rag_service.py' });
    }
};

// ─── Status ────────────────────────────────────────────────
router.get('/status', async (req, res) => {
    try {
        const data = await ragRequest('/rag/status', null, 'GET');
        res.json(data);
    } catch {
        res.status(503).json({ status: 'offline', message: 'Start python Server/rag/rag_service.py' });
    }
});

// ─── Chat (Product Advisor) ────────────────────────────────
router.post('/chat', async (req, res) => {
    await forwardToRAG('/rag/chat', req.body, res);
});

// ─── Semantic Search ───────────────────────────────────────
router.post('/search', async (req, res) => {
    await forwardToRAG('/rag/search', req.body, res);
});

// ─── Review Summary ────────────────────────────────────────
router.post('/reviews/summary', async (req, res) => {
    await forwardToRAG('/rag/reviews/summary', req.body, res);
});

// ─── Guidance Q&A ──────────────────────────────────────────
router.post('/guidance', async (req, res) => {
    await forwardToRAG('/rag/guidance', req.body, res);
});

// ─── Sync products from MongoDB into RAG index ─────────────
router.post('/sync/products', async (req, res) => {
    try {
        const Application = require('../models/Application');
        const apps = await Application.find({ status: 'Approved' });

        const products = [];
        apps.forEach(app => {
            if (!app.products) return;
            const logo = app.documents?.find(d => d.title === 'Company photo')?.url || '';
            app.products.forEach((prod, idx) => {
                const prodId = `${app._id}-${idx}`;
                const idHash = prodId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                products.push({
                    id: prodId,
                    name: prod.name,
                    category: prod.category || 'Herbal',
                    description: prod.description || '',
                    store: app.companyName,
                    price: prod.price || 50,
                    rating: (4 + (idHash % 10) / 10).toFixed(1),
                    image: prod.image || logo
                });
            });
        });

        const data = await ragRequest('/rag/index/products', { products }, 'POST');
        res.json({ ...data, total_products: products.length });
    } catch (err) {
        console.error('Product sync error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── Index reviews ─────────────────────────────────────────
router.post('/index/reviews', async (req, res) => {
    await forwardToRAG('/rag/index/reviews', req.body, res);
});

// ─── Index guidance docs ───────────────────────────────────
router.post('/index/guidance', async (req, res) => {
    await forwardToRAG('/rag/index/guidance', req.body, res);
});

module.exports = router;
