
const express = require('express');
const router = express.Router();

const NationalData = require('../models/NationalData');
const State = require('../models/State');
const Surveillance = require('../models/Surveillance');
const ThreatSignals = require('../models/ThreatSignals');

// const { surveillanceMapData } = require('../data/surveillanceData'); // For map data which is simpler here

// GET National Dashboard Data (US or India)
router.get('/national/:country', async (req, res) => {
    try {
        const country = req.params.country.toUpperCase();
        if (country !== 'US' && country !== 'INDIA') {
            return res.status(400).json({ error: 'Invalid country specified' });
        }
        const data = await NationalData.findOne({ country: country });
        if (!data) {
            return res.status(404).json({ error: 'Data not found for the specified country' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Biological & Chemical Weapon Threat Signals
router.get('/threat-signals', async (req, res) => {
    try {
        const data = await ThreatSignals.findOne({});
        if (!data) return res.status(404).json({ error: "Threat signal data not found" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET State Detail Data
router.get('/states/detail/:stateId', async (req, res) => {
    try {
        const stateId = req.params.stateId.toUpperCase();
        const data = await State.findOne({ id: stateId });
        if (!data) {
            return res.status(404).json({ error: 'Data not found for the specified state' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET Surveillance Map Data for a specific type
router.get('/surveillance/map/:type', (req, res) => {
    try {
        const type = req.params.type.toLowerCase();
        // const data = surveillanceMapData[type];
        const data = null;
        if (!data) {
            return res.status(404).json({ error: 'Data not found for the specified surveillance type' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET Surveillance Detail Data for a specific state and type
router.get('/surveillance/detail/:type/:stateId', async (req, res) => {
    try {
        const type = req.params.type.toLowerCase();
        const stateId = req.params.stateId.toUpperCase();

        const surveillanceDoc = await Surveillance.findOne({});
        if (!surveillanceDoc || !surveillanceDoc[type] || !surveillanceDoc[type].get(stateId)) {
            return res.status(404).json({ error: 'Surveillance data not found for the specified type and state' });
        }

        const data = surveillanceDoc[type].get(stateId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all surveillance data
router.get('/surveillance/all', async (req, res) => {
    try {
        const data = await Surveillance.findOne({});
        if (!data) {
            return res.status(404).json({ error: 'Surveillance data not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;