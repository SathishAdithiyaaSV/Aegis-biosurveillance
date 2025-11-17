const express = require('express');
const router = express.Router();
const Surveillance = require('../models/Surveillance');

// -----------------------------
// 1. GET MAP DATA BY TYPE
// -----------------------------
router.get('/map/:type', async (req, res) => {
    const { type } = req.params;

    try {
        const record = await Surveillance.findOne({});
        if (!record) {
            return res.status(404).json({ error: "Surveillance dataset not found." });
        }

        const typeMap = record[type];
        if (!typeMap) {
            return res.status(400).json({ error: `Invalid surveillance type: ${type}` });
        }

        const response = [];

        for (const [stateId, stateData] of typeMap.entries()) {
            response.push({
                id: stateId,
                name: stateId,            // You can map ID -> name if you want later
                value: Math.floor(Math.random() * 100) + 1  // Temporary risk index
            });
        }

        res.json(response);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// -----------------------------
// 2. GET DETAILED STATE DATA
// -----------------------------
router.get('/detail/:type/:stateId', async (req, res) => {
    const { type, stateId } = req.params;

    try {
        const record = await Surveillance.findOne({});
        if (!record) {
            return res.status(404).json({ error: "Surveillance dataset not found." });
        }

        const typeMap = record[type];
        if (!typeMap) {
            return res.status(400).json({ error: `Invalid surveillance type: ${type}` });
        }

        const stateData = typeMap.get(stateId);
        if (!stateData) {
            return res.status(404).json({ error: `No ${type} data found for state ${stateId}.` });
        }

        res.json(stateData);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// -----------------------------
// 3. GET ALL SURVEILLANCE DATA
// -----------------------------
router.get('/all', async (req, res) => {
    try {
        const record = await Surveillance.findOne({});
        if (!record) {
            return res.status(404).json({ error: "Surveillance dataset not found." });
        }

        res.json(record);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
