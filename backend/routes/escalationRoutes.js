const express = require("express");
const router = express.Router();
const Escalation = require("../models/Escalation");
const { sendSMS, makeCall } = require('../services/twilioService');

// GET active escalation
router.get("/active", async (req, res) => {
  try {
    const esc = await Escalation.findOne().sort({ createdAt: -1 });
    res.json(esc || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE escalation
router.post('/escalate', async (req, res) => {
  try {
    const { level, from, alert } = req.body;

    const doc = await Escalation.create({
      level,
      from,
      alert,
      status: 'escalated'
    });

    const alertSummary = `🚨 Emergency Alert (${level})
Source: ${from}
Event: ${alert.title}
Location: ${alert.location}
Severity: ${alert.severity}`;

    // Send SMS
    sendSMS(process.env.ALERT_PHONE_NUMBER, alertSummary);

    // Make Call (optional)
    makeCall(process.env.ALERT_PHONE_NUMBER, `${alert.title} at ${alert.location}. Severity: ${alert.severity}. Immediate action required.`);

    return res.json({ success: true, escalation: doc });
  } catch (err) {
    console.error('Escalation Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ACKNOWLEDGE → monitoring
router.put("/acknowledge/:id", async (req, res) => {
  try {
    const updated = await Escalation.findByIdAndUpdate(
      req.params.id,
      { status: "monitoring", updatedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESOLVE escalation
router.delete("/resolve/:id", async (req, res) => {
  try {
    await Escalation.findByIdAndDelete(req.params.id);
    res.json({ message: "Escalation resolved & removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
