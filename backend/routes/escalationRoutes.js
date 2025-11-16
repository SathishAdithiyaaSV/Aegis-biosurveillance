const express = require("express");
const router = express.Router();
const Escalation = require("../models/Escalation");

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
router.post("/escalate", async (req, res) => {
  try {
    const newEsc = await Escalation.create(req.body);
    res.json(newEsc);
  } catch (err) {
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
