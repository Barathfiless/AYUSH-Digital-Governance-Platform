const express = require('express');
const router = express.Router();

// Mock data representing current Acts & Rules from Ministry of Ayush
const actsData = [
    {
        title: 'Drugs and Cosmetics Act, 1940',
        description: 'An Act to regulate the import, manufacture, distribution and sale of drugs and cosmetics, ensuring quality and safety standards.',
        tag: 'Primary Act',
        date: '1940',
        url: 'https://ayush.gov.in/File-size/Drugs-and-Cosmetics-Act-1940.pdf'
    },
    {
        title: 'Drugs and Cosmetics Rules, 1945',
        description: 'Comprehensive rules framed under the Act for administrative and technical implementation across the country.',
        tag: 'Regulation',
        date: '1945',
        url: 'https://ayush.gov.in/File-size/Drugs-and-Cosmetics-Rules-1945.pdf'
    },
    {
        title: 'Ayurveda, Siddha and Unani Drugs Technical Advisory Board (ASDTAB)',
        description: 'Official guidelines for the constitution and functions of the technical advisory board for traditional medicine.',
        tag: 'Board Guidelines',
        date: 'Revised 2018',
        url: 'https://ayush.gov.in/File-size/ASDTAB-Guidelines.pdf'
    },
    {
        title: 'National Commission for Indian System of Medicine Act, 2020',
        description: 'Act providing for a medical education system that improves access to quality and affordable medical education.',
        tag: 'Education Act',
        date: '2020',
        url: 'https://ayush.gov.in/File-size/NCISM-Act-2020.pdf'
    },
    {
        title: 'Homoeopathy Central Council Act, 1973',
        description: 'An Act to provide for the constitution of a Central Council of Homoeopathy and the maintenance of a Central Register of Homoeopathy.',
        tag: 'Council Act',
        date: '1973',
        url: 'https://ayush.gov.in/File-size/HCC-Act-1973.pdf'
    },
    {
        title: 'The Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954',
        description: 'An Act to control the advertisement of drugs in certain cases and to prohibit the advertisement of magic remedies.',
        tag: 'Compliance Act',
        date: '1954',
        url: 'https://ayush.gov.in/File-size/Magic-Remedies-Act-1954.pdf'
    }
];

// ── GET: all acts and rules ───────────────────────────────────────────────────
router.get('/', (req, res) => {
    try {
        // In a real scenario, this might pulse an external government RSS/API feed
        // For now, we return our curated, updateable list
        res.json(actsData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching acts', error: error.message });
    }
});

module.exports = router;
