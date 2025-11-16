
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DistrictProfileSchema = new Schema({
    population: String,
    geography: String,
    hospitals: Number,
    healthcareEffectiveness: String,
    climaticZones: Number,
    prevalentDiseases: [String],
    ecologicalFactors: [String]
}, { _id: false });

const LocalEnvironmentalSignalSchema = new Schema({
    id: Number,
    description: String,
    sourceType: String,
    imageUrl: String,
    highlight: Boolean
}, { _id: false });

const DistrictSurveillanceDataSchema = new Schema({
    vectorDensityIndex: String,
    feverSurveyReports: Number,
    localEnvironmentalSignals: [LocalEnvironmentalSignalSchema],
    livestockAlerts: [Schema.Types.Mixed],
    cropDiseaseAlerts: [Schema.Types.Mixed],
    genomicSignals: [Schema.Types.Mixed]
}, { _id: false });


const DistrictSchema = new Schema({
    id: String,
    name: String,
    value: Number,
    profile: DistrictProfileSchema,
    kpis: [Schema.Types.Mixed],
    alerts: [Schema.Types.Mixed],
    hospitalData: {
        bedOccupancy: Number,
        icuOccupancy: Number,
        ventilatorAvailability: Number,
        staffStatus: String
    },
    surveillanceData: DistrictSurveillanceDataSchema,
    drugInventory: [Schema.Types.Mixed],
    aiSummary: String,
    socioeconomicData: {
        povertyRate: Number,
        literacyRate: Number,
        sanitationAccess: Number
    },
    oneHealthScore: {
        overall: Number,
        human: Number,
        animal: Number,
        environment: Number
    }
});

const StateSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profile: Schema.Types.Mixed,
    kpis: [Schema.Types.Mixed],
    alerts: [Schema.Types.Mixed],
    trendData: [Schema.Types.Mixed],
    viralGenomics: Schema.Types.Mixed,
    aiSummary: String,
    districts: [DistrictSchema],
    districtPaths: [Schema.Types.Mixed],
    drugInventory: [Schema.Types.Mixed],
    vaccineInventory: [Schema.Types.Mixed],
    zoonoticAlerts: [Schema.Types.Mixed],
    environmentalAlerts: [Schema.Types.Mixed],
    predictionDetails: Schema.Types.Mixed,
    genomicSignals: [Schema.Types.Mixed]
});

module.exports = mongoose.model('State', StateSchema);
