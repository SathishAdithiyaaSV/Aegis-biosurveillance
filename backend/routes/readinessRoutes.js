const express = require('express');
const router = express.Router();
const Readiness = require('../models/Readiness');

// GET readiness for level + location
router.get('/:level/:location', async (req, res) => {
    try {
        const { level, location } = req.params;

        const items = await Readiness.find({ 
            level, 
            location: new RegExp(`^${location}$`, 'i') 
        });

        if (!items.length) {
            return res.json([]); // Return empty instead of 404
        }

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
