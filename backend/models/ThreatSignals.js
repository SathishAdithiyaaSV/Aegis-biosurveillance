const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreatSignalSchema = new Schema({
    agent: String,
    signatureType: String,
    location: String,
    status: String,
    signalStrength: Number,
    concentration: Number,
    sourceType: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const ThreatSignalsSchema = new Schema({
    biologicalSignals: {
        US: [ThreatSignalSchema],
        India: [ThreatSignalSchema],
    },
    chemicalSignals: {
        US: [ThreatSignalSchema],
        India: [ThreatSignalSchema],
    }
}, { collection: "threat_signals" });

module.exports = mongoose.model("ThreatSignals", ThreatSignalsSchema);
