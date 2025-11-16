const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EscalationSchema = new Schema({
    level: { type: String, enum: ["National", "State", "District"], required: true },
    from: { type: String, required: true },
    alert: {
        id: String,
        title: String,
        severity: String,
        location: String,
        timestamp: String
    },
    status: { type: String, enum: ["escalated", "monitoring"], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: "escalations" });

module.exports = mongoose.model("Escalation", EscalationSchema);
