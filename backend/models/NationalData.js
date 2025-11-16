
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schemas for nested objects to ensure structure
const KpiDetailSchema = new Schema({
    type: String,
    data: [Schema.Types.Mixed],
    prediction: { name: String, value: Number },
    summary: String
}, { _id: false });

const KpiSchema = new Schema({
    title: String,
    value: String,
    change: String,
    changeType: String,
    details: KpiDetailSchema
}, { _id: false });

const AlertSchema = new Schema({
    id: Number,
    title: String,
    location: String,
    timestamp: String,
    severity: String,
    date: String
}, { _id: false });

const ThreatSchema = new Schema({
    name: String,
    threatLevel: Number,
    trend: String,
    summaryPrompt: String
}, { _id: false });

const BiosecurityComponentSchema = new Schema({
    score: Number,
    contextPrompt: String
}, { _id: false });

const NationalDataSchema = new Schema({
    country: {
        type: String,
        required: true,
        unique: true,
        enum: ['US', 'India']
    },
    kpiData: [KpiSchema],
    oneHealthData: Schema.Types.Mixed,
    biowarfareThreats: [Schema.Types.Mixed],
    nationalLabNetworkStatus: [Schema.Types.Mixed],
    nationalBiosecurityIndexData: {
        score: Number,
        level: String,
        breakdown: {
            intel: BiosecurityComponentSchema,
            labReadiness: BiosecurityComponentSchema,
            countermeasures: BiosecurityComponentSchema,
            populationVulnerability: BiosecurityComponentSchema
        }
    },
    trendData: Schema.Types.Mixed,
    alerts: [AlertSchema],
    aiSummary: String,
    threatSpectrumData: [ThreatSchema],
    mapData: [{
        id: String,
        name: String,
        value: Number,
        dominantPathogen: String
    }]
});

module.exports = mongoose.model('NationalData', NationalDataSchema);
