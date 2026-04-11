const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.post('/analyze', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const scriptPath = path.join(__dirname, '../scripts/analyze_sentiment.py');
        const pythonProcess = spawn('python', [scriptPath, text]);

        let resultData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}: ${errorData}`);
                return res.status(500).json({ error: 'Internal server error during analysis' });
            }

            try {
                const analysis = JSON.parse(resultData);
                res.json(analysis);
            } catch (err) {
                console.error('Error parsing Python output:', err);
                res.status(500).json({ error: 'Failed to parse analysis result' });
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
