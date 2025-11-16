require('dotenv').config();
const mongoose = require('mongoose');
const { nationalDataUS, nationalDataIndia, detailedStateData, allSurveillanceData, threatSignalData } = require('./data/seedData');

const NationalData = require('./models/NationalData');
const State = require('./models/State');
const Surveillance = require('./models/Surveillance');
const ThreatSignals = require('./models/ThreatSignals');
const Readiness = require('./models/Readiness');

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

        await Readiness.deleteMany({});

        await Readiness.insertMany([
        // NATIONAL
        {
            level: 'National',
            location: 'India',
            organization: 'NDRF',
            status: 'Standby',
            personnel: '2 battalions on alert',
            equipment: 'Hazmat units, mobile hospitals',
            updateTime: '15 mins ago'
        },
        {
            level: 'National',
            location: 'India',
            organization: 'ICMR',
            status: 'Mobilizing',
            personnel: 'Epidemiology teams assembling',
            equipment: 'Mobile BSL-3 labs preparing',
            updateTime: '5 mins ago'
        },

        // STATE
        {
            level: 'State',
            location: 'Kerala',
            organization: 'Kerala Public Health Department',
            status: 'Mobilizing',
            personnel: 'RRT teams deployed',
            equipment: 'Emergency supplies dispatched',
            updateTime: '8 mins ago'
        },

        // DISTRICT
        {
            level: 'District',
            location: 'Ernakulam',
            organization: 'District Medical Office',
            status: 'Engaged',
            personnel: 'Field teams conducting tracing',
            equipment: 'PHCs on 24/7 alert',
            updateTime: '2 mins ago'
        }
        ]);

        console.log('All seeding complete!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
