require('dotenv').config();
const mongoose = require('mongoose');
const { nationalDataUS, nationalDataIndia, detailedStateData, allSurveillanceData, threatSignalData } = require('./data/seedData');

const NationalData = require('./models/NationalData');
const State = require('./models/State');
const Surveillance = require('./models/Surveillance');
const ThreatSignals = require('./models/ThreatSignals');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        console.log('Clearing existing data...');
        await NationalData.deleteMany({});
        await State.deleteMany({});
        await Surveillance.deleteMany({});
        await ThreatSignals.deleteMany({});

        // Seed National data
        await NationalData.insertMany([nationalDataUS, nationalDataIndia]);
        console.log('National Data seeded!');

        // Seed States
        await State.insertMany(Object.values(detailedStateData));
        console.log('State Data seeded!');

        // Seed Surveillance data
        await Surveillance.create(allSurveillanceData);
        console.log('Surveillance Data seeded!');

        // Seed Threat Signal data
        await ThreatSignals.create(threatSignalData);
        console.log('Threat Signals seeded!');

        console.log('All seeding complete!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
