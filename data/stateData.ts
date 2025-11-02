import { DetailedStateData } from '../types';

const now = new Date();

export const detailedStateData: Record<string, DetailedStateData> = {
  KL: {
    id: 'KL',
    name: 'Kerala',
    profile: {
      population: '35.7 Million',
      populationDensity: '860/km²',
      climate: 'Tropical Monsoon with distinct wet and dry seasons.',
      geography: 'Coastal plains, central highlands, extensive backwaters, and forests.',
      hygieneIndex: 82,
      dataSources: [
        { name: 'Kerala State Health Services', credibility: 95, bias: 'Low' },
        { name: 'National Centre for Disease Control (NCDC)', credibility: 98, bias: 'Low' },
        { name: 'Indian Council of Medical Research (ICMR)', credibility: 97, bias: 'Low' },
      ],
      healthcareCapacity: {
        icuBedsAvailable: '1,250',
        ventilatorsAvailable: '800',
        healthcareWorkerStatus: 'Strained',
      },
      publicHealthResponse: {
        testingRatePer1000: 15.2,
        contactTracingEfficiency: 78,
      },
      socioeconomicFactors: {
        urbanizationLevel: 47.7,
        literacyRate: 96.2,
      }
    },
    kpis: [
      { title: 'New Dengue Cases (24h)', value: '3,210', change: '+12.5%', changeType: 'increase' },
      { title: 'Active Alerts', value: '4', change: '+1 Critical', changeType: 'increase' },
      { title: 'Hospital Bed Occupancy', value: '88%', change: 'High', changeType: 'increase' },
    ],
    alerts: [
      { id: 1, title: 'Severe Dengue Outbreak', district: 'Ernakulam', timestamp: '3 hours ago', severity: 'Critical', date: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString() },
      { id: 2, title: 'Leptospirosis Cases Rising', district: 'Thrissur', timestamp: '1 day ago', severity: 'High', date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() },
    ],
    trendData: [
        { name: '4w ago', value: 1200 },
        { name: '3w ago', value: 1800 },
        { name: '2w ago', value: 2500 },
        { name: 'Last week', value: 2850 },
        { name: 'This week', value: 3210 },
    ],
    viralGenomics: {
        dominantStrain: 'DENV-2 Serotype',
        viralLoad: 85,
        viralLoadChange: 15, // +15%
        strainSummaryPrompt: 'Focus on why DENV-2 is associated with more severe outcomes like Dengue Hemorrhagic Fever.',
        dataSource: 'INSACOG Genomic Surveillance',
    },
    aiSummary: `
- State: Kerala
- Primary Threat: Severe Dengue outbreak, DENV-2 serotype, concentrated in Ernakulam district.
- Case Velocity: New cases are increasing rapidly at +12.5% daily.
- Healthcare Strain: Hospital bed occupancy is at a critical 88%. Healthcare workers are strained.
- Secondary Threat: Post-monsoon Leptospirosis cases are on the rise in Thrissur.
- Zoonotic Risk: High vigilance for Nipah Virus in Kozhikode due to proximity to known fruit bat reservoirs.
- Environmental Signals: High Dengue RNA in Ernakulam wastewater; Leptospira DNA in Thrissur floodwater.
- Environmental Factors: Tropical monsoon climate and high population density are exacerbating vector-borne disease spread. Coastal and forest geography creates diverse breeding grounds for vectors.
- Public Health Response: Contact tracing efficiency is at 78%, may require enhancement to curb spread.
- Dominant Strains: DENV-2 is the primary concern. Historical context of Nipah Virus requires high alert for any neurological symptom clusters.
`,
    drugInventory: [
        { name: 'Paracetamol 500mg', stock: 80000, burnRate: 12000, category: 'Analgesic' },
        { name: 'IV Fluids (Saline)', stock: 25000, burnRate: 4500, category: 'IV Fluid' },
        { name: 'Platelet Transfusion Kits', stock: 500, burnRate: 150, category: 'Medical Supply' },
        { name: 'Doxycycline 100mg', stock: 40000, burnRate: 2500, category: 'Antibiotic' },
    ],
    vaccineInventory: [
        { name: 'DengueShield (Inactivated)', targetPathogen: 'Dengue (All Serotypes)', type: 'Inactivated', dosesAvailable: 2_500_000, monthlyProductionCapacity: 0, efficacy: 85, wastageRate: 12 },
        { name: 'NipahGuard (mRNA)', targetPathogen: 'Nipah Virus (NiV)', type: 'mRNA', dosesAvailable: 50_000, monthlyProductionCapacity: 0, efficacy: 95, wastageRate: 18 },
    ],
    zoonoticAlerts: [
      { name: 'Nipah Virus (NiV)', location: 'Kozhikode district', risk: 'Critical', interfaceProximity: 'High', primaryVector: 'Fruit Bats' },
      { name: 'Avian Influenza (H5N1)', location: 'Alappuzha poultry farms', risk: 'High', interfaceProximity: 'Direct', primaryVector: 'Migratory Birds / Poultry' },
    ],
    environmentalAlerts: [
      { name: 'Dengue RNA', location: 'Ernakulam Sentinel Site', status: 'Trending', signalStrength: 180, sourceType: 'Wastewater' },
      { name: 'Leptospira DNA', location: 'Thrissur Floodplains', status: 'Confirmed', sourceType: 'Floodwater' },
      { name: 'Avian Influenza RNA', location: 'Kerala Statewide Sentinel Network', status: 'Trending', signalStrength: 85, sourceType: 'Zoonotic Wastewater' },
    ],
    districtPaths: [
        { id: 'EKM', name: 'Ernakulam', d: 'M150 200 L170 190 L180 210 L160 220 Z' },
        { id: 'TSR', name: 'Thrissur', d: 'M155 170 L175 160 L185 180 L165 190 Z' },
        { id: 'TVM', name: 'Thiruvananthapuram', d: 'M140 230 L160 220 L170 240 L150 250 Z' },
        { id: 'KTM', name: 'Kottayam', d: 'M170 215 L190 205 L200 225 L180 235 Z' },
    ],
    districts: [
        { 
            id: 'EKM', 
            name: 'Ernakulam', 
            value: 1250, 
            profile: { 
                population: '3.4 Million', 
                geography: 'Coastal, Major port city, High tourist footfall', 
                hospitals: 25,
                healthcareEffectiveness: 'Moderate',
                climaticZones: 1,
                prevalentDiseases: ['Dengue', 'Leptospirosis', 'Chikungunya'],
            },
            kpis: [
                { title: 'New Cases (24h)', value: '450', change: '+15%', changeType: 'increase' },
            ],
            alerts: [
                { id: 101, title: 'Hospital ICU Capacity Critical', timestamp: '1 hour ago', severity: 'Critical', date: new Date().toISOString() }
            ],
            hospitalData: {
                bedOccupancy: 95,
                icuOccupancy: 98,
                ventilatorAvailability: 15,
                staffStatus: 'Overwhelmed',
            },
            surveillanceData: {
                vectorDensityIndex: 'High',
                feverSurveyReports: 1205,
                localEnvironmentalSignals: [
                    { id: 5, description: 'Uncovered water storage found, confirmed mosquito breeding ground sample.', sourceType: 'Water Management', highlight: true, imageUrl: 'https://i.imgur.com/v2t5v1L.png' },
                    { id: 6, description: 'Avian Influenza RNA detected in poultry farm wastewater near Perumbavoor.', sourceType: 'Zoonotic Wastewater' },
                    { id: 7, description: 'High coliform bacteria count in public well, Aluva region.', sourceType: 'Water Source' },
                    { id: 2, description: 'Unusual mosquito breeding reported at Fort Kochi tourist area', sourceType: 'Community Report', imageUrl: 'https://i.imgur.com/Q7b2b0E.jpg' },
                    { id: 3, description: 'Increased rodent sightings near Mattancherry market', sourceType: 'Market' },
                    { id: 4, description: 'Leptospira DNA traces in wastewater, Kakkanad IT park area.', sourceType: 'Zoonotic Wastewater' },
                ],
            },
            drugInventory: [
                { name: 'Paracetamol 500mg', stock: 20000, burnRate: 4000, category: 'Analgesic' },
                { name: 'IV Fluids (Saline)', stock: 5000, burnRate: 1500, category: 'IV Fluid' },
                { name: 'Platelet Transfusion Kits', stock: 100, burnRate: 50, category: 'Medical Supply' },
            ],
            aiSummary: `
- District: Ernakulam
- Primary Threat: Critical Dengue outbreak (DENV-2), with a 15% daily case increase, exacerbated by poor water management practices. Water surveillance has also identified high coliform counts in public wells in Aluva, increasing risk of water-borne diseases.
- Geography: The coastal port city with high tourist footfall is a major factor in rapid transmission. Beaches and urban markets are high-risk zones.
- Healthcare Strain: ICU capacity is at 98%, and staff are overwhelmed. Immediate support is required.
- Local Intel: Community reports confirm high mosquito breeding in tourist areas (Fort Kochi). Zoonotic surveillance is tracking multiple threats, with Leptospira DNA near the IT corridor and Avian Influenza RNA detected in poultry farm wastewater near Perumbavoor.
- Drug Inventory: Platelet kits have only 2 Days of Supply (DoS) remaining, a critical shortage. IV fluids are also low.
`
        },
        { 
            id: 'TSR', 
            name: 'Thrissur', 
            value: 800,
            profile: { 
                population: '3.2 Million',
                geography: 'Coastal plains, Central highlands (forests)',
                hospitals: 18,
                healthcareEffectiveness: 'High',
                climaticZones: 2,
                prevalentDiseases: ['Leptospirosis', 'Dengue'],
            },
            kpis: [
                { title: 'New Cases (24h)', value: '180', change: '+8%', changeType: 'increase' },
            ],
            alerts: [
                { id: 102, title: 'Contaminated Water Source Found', timestamp: '6 hours ago', severity: 'High', date: new Date().toISOString() }
            ],
            hospitalData: {
                bedOccupancy: 78,
                icuOccupancy: 85,
                ventilatorAvailability: 45,
                staffStatus: 'Strained',
            },
            surveillanceData: {
                vectorDensityIndex: 'High',
                feverSurveyReports: 650,
                localEnvironmentalSignals: [
                    { id: 1, description: 'Leptospira DNA in Chalakudy River', sourceType: 'Water Source' }
                ],
            },
            drugInventory: [
                 { name: 'Doxycycline 100mg', stock: 15000, burnRate: 1200, category: 'Antibiotic' }
            ],
            aiSummary: `
- District: Thrissur
- Primary Threat: Rising Leptospirosis cases linked to contaminated river water post-monsoon.
- Geography: Forested highlands and coastal plains create diverse environments for zoonotic and water-borne diseases.
`
        },
        { 
            id: 'TVM', 
            name: 'Thiruvananthapuram', 
            value: 650,
            profile: { 
                population: '3.3 Million', 
                geography: 'Coastal, State Capital', 
                hospitals: 30,
                healthcareEffectiveness: 'High',
                climaticZones: 1,
                prevalentDiseases: ['Dengue', 'Typhoid'],
            },
            kpis: [
                { title: 'New Cases (24h)', value: '110', change: '+5%', changeType: 'increase' },
            ],
            alerts: [
                { id: 103, title: 'Dengue Awareness Drive Launched', timestamp: '1 day ago', severity: 'Moderate', date: new Date().toISOString() }
            ],
            hospitalData: {
                bedOccupancy: 65,
                icuOccupancy: 70,
                ventilatorAvailability: 60,
                staffStatus: 'Adequate',
            },
            surveillanceData: {
                vectorDensityIndex: 'Moderate',
                feverSurveyReports: 420,
                localEnvironmentalSignals: [],
            },
            drugInventory: [],
            aiSummary: 'Cases are stable, but vigilance is required due to proximity to high-risk zones.'
        },
        {
            id: 'KTM',
            name: 'Kottayam',
            value: 510,
            profile: {
                population: '2.0 Million',
                geography: 'Highlands, Rubber plantations',
                hospitals: 15,
                healthcareEffectiveness: 'Moderate',
                climaticZones: 1,
                prevalentDiseases: ['Dengue', 'Scrub Typhus'],
            },
            kpis: [
                { title: 'New Cases (24h)', value: '95', change: '+4%', changeType: 'increase' },
            ],
            alerts: [],
            hospitalData: {
                bedOccupancy: 72,
                icuOccupancy: 68,
                ventilatorAvailability: 55,
                staffStatus: 'Strained',
            },
            surveillanceData: {
                vectorDensityIndex: 'Moderate',
                feverSurveyReports: 312,
                localEnvironmentalSignals: [],
            },
            drugInventory: [],
            aiSummary: 'Low case count, but a strained healthcare system indicates low baseline capacity.'
        }
    ]
  },
  MH: {
    id: 'MH',
    name: 'Maharashtra',
    profile: {
      population: '126.4 Million',
      populationDensity: '370/km²',
      climate: 'Tropical Wet and Dry',
      geography: 'Coastal plains (Konkan), Deccan plateau, Western Ghats.',
      hygieneIndex: 68,
      dataSources: [
        { name: 'Directorate of Health Services, Maharashtra', credibility: 94, bias: 'Low' },
        { name: 'National Centre for Disease Control (NCDC)', credibility: 98, bias: 'Low' },
        { name: 'World Health Organization (WHO) India', credibility: 99, bias: 'Low' },
      ],
    },
    kpis: [
      { title: 'New Dengue Cases (24h)', value: '1,850', change: '+6.2%', changeType: 'increase' },
      { title: 'Suspected Malaria Cases', value: '420', change: '-2.1%', changeType: 'decrease' },
      { title: 'Air Quality Index (AQI)', value: '155 (Unhealthy)', change: 'Worsening', changeType: 'increase' },
    ],
    alerts: [
        { id: 1, title: 'Dengue Spike in Urban Areas', district: 'Mumbai', timestamp: '18 hours ago', severity: 'High', date: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString() },
        { id: 2, title: 'H1N1 Cluster Detected', district: 'Pune', timestamp: '2 days ago', severity: 'High', date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    trendData: [
        { name: '4w ago', value: 900 },
        { name: '3w ago', value: 1100 },
        { name: '2w ago', value: 1450 },
        { name: 'Last week', value: 1740 },
        { name: 'This week', value: 1850 },
    ],
    viralGenomics: {
        dominantStrain: 'DENV-1 Serotype',
        viralLoad: 65,
        viralLoadChange: 8, // +8%
        strainSummaryPrompt: 'Focus on DENV-1 being a common serotype causing classic Dengue fever in densely populated urban areas.',
        dataSource: 'NIV Pune Sequencing Data',
    },
    aiSummary: `
- State: Maharashtra
- Primary Threat: Dengue (DENV-1) outbreak, heavily affecting dense urban centers like Mumbai.
- Secondary Threat: A new H1N1 cluster has been identified in Pune, requiring immediate containment measures.
- Environmental Factors: Poor air quality in major cities may be exacerbating respiratory conditions, potentially complicating diagnoses. Diverse geography from coastal areas to plateaus supports various disease vectors.
- Population Dynamics: The large and dense population of 126.4 million presents a significant challenge for controlling community transmission.
- Dominant Strains: DENV-1 and Influenza H1N1 are the key pathogens to monitor.
`,
    drugInventory: [
        { name: 'Paracetamol 500mg', stock: 150000, burnRate: 15000, category: 'Analgesic' },
        { name: 'Oseltamivir (Tamiflu)', stock: 12000, burnRate: 2800, category: 'Antiviral' },
        { name: 'IV Fluids (Saline)', stock: 60000, burnRate: 5000, category: 'IV Fluid' },
        { name: 'Azithromycin 500mg', stock: 95000, burnRate: 7000, category: 'Antibiotic' },
    ],
    vaccineInventory: [],
    districts: [],
    districtPaths: [],
  },
  // Add other states here as needed to expand the demo
};
