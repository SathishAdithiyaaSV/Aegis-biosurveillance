
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define sub-schemas for different surveillance data types
const LivestockStateDataSchema = new Schema({
    vaccinationStats: [Schema.Types.Mixed],
    prevalentDiseases: [Schema.Types.Mixed],
    aiSummary: String,
}, { _id: false });

const ZoonoticStateDataSchema = new Schema({
    highRiskVectors: [Schema.Types.Mixed],
    sentinelSpecies: [Schema.Types.Mixed],
    aiSummary: String,
}, { _id: false });

const EnvironmentalStateDataSchema = new Schema({
    waterSources: [Schema.Types.Mixed],
    airQualityHotspots: [Schema.Types.Mixed],
    aiSummary: String,
}, { _id: false });

const StateGenomicDataSchema = new Schema({
    circulatingStrains: [Schema.Types.Mixed],
    sequencingCapacity: {
        labs: Number,
        throughput: Number,
    },
    aiSummary: String,
}, { _id: false });

const WildlifeStateDataSchema = new Schema({
    populationStatus: [Schema.Types.Mixed],
    interfaceHotspots: [Schema.Types.Mixed],
    aiSummary: String,
}, { _id: false });

const DisasterStateDataSchema = new Schema({
    currentRisks: [Schema.Types.Mixed],
    preparedness: [Schema.Types.Mixed],
    aiSummary: String,
}, { _id: false });


const SurveillanceSchema = new Schema({
    // Using Map type to store state-specific data, keyed by state ID (e.g., 'KL')
    livestock: {
        type: Map,
        of: LivestockStateDataSchema,
    },
    zoonotic: {
        type: Map,
        of: ZoonoticStateDataSchema,
    },
    environmental: {
        type: Map,
        of: EnvironmentalStateDataSchema,
    },
    genomic: {
        type: Map,
        of: StateGenomicDataSchema,
    },
    wildlife: {
        type: Map,
        of: WildlifeStateDataSchema,
    },
    disaster: {
        type: Map,
        of: DisasterStateDataSchema,
    },
}, { collection: 'surveillance_data' });

module.exports = mongoose.model('Surveillance', SurveillanceSchema);
