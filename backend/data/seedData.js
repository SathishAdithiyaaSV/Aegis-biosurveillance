
// This file consolidates data from constants.ts, stateData.ts, and surveillanceData.ts
// for easier processing by the seed script.

const now = new Date();

// --- USA DATA ---
const oneHealthIndexDataUS = {
  human: { newCases: 14289, newCasesChange: 5.2, activeHotspots: 42, hospitalizationRate: 8.2, icuRate: 2.1 },
  zoonotic: [
    { name: 'Avian Influenza (H5N1)', location: 'Poultry farms, IA', risk: 'High', interfaceProximity: 'Direct' },
    { name: 'Canine Distemper Virus', location: 'Stray population, AZ', risk: 'Moderate', interfaceProximity: 'High' },
  ],
  environmental: [
    { name: 'Influenza A RNA Spike', location: 'Chicago Sentinel Site #2', status: 'Trending', signalStrength: 150 },
    { name: 'Poliovirus Traces', location: 'NYC Sentinel Site #4', status: 'Confirmed' },
  ],
  wildlife: [
    { species: 'White-tailed Deer', disease: 'Chronic Wasting Disease (CWD)', location: 'Wisconsin, USA', riskToHumans: 'Unknown', potentialImpact: 'Ecosystem disruption, potential long-term risk.' },
    { species: 'Wild Boar', disease: 'African Swine Fever (ASF)', location: 'Feral populations, Southern US', riskToHumans: 'Low', potentialImpact: 'Major threat to domestic swine industry.' },
  ],
  disasters: [
    { disasterType: 'Hurricane', location: 'Gulf Coast, USA', severity: 'Major', associatedDiseaseRisks: ['Vibrio infections', 'Leptospirosis', 'Mosquito-borne diseases'] },
    { disasterType: 'Wildfire', location: 'California, USA', severity: 'Major', associatedDiseaseRisks: ['Respiratory illnesses from smoke', 'Contaminated water sources'] },
  ],
  vaccineInventory: [
    { name: 'Aegis-FluVax (mRNA)', targetPathogen: 'Influenza A (H3N2)', type: 'mRNA', dosesAvailable: 15000000, monthlyProductionCapacity: 5000000, efficacy: 92, wastageRate: 5 },
    { name: 'CovaShield (Viral Vector)', targetPathogen: 'SARS-CoV-2', type: 'Viral Vector', dosesAvailable: 40000000, monthlyProductionCapacity: 10000000, efficacy: 88, wastageRate: 8 },
    { name: 'NoroVax (Subunit)', targetPathogen: 'Norovirus', type: 'Subunit', dosesAvailable: 5000000, monthlyProductionCapacity: 1000000, efficacy: 75, wastageRate: 12 },
  ],
  genomic: [
    { id: 'us1', strainName: 'Influenza A (H3N2) - 2b.1a', location: 'Midwest Region', significance: 'Vaccine Escape', summary: 'A new clade showing reduced neutralization from current vaccine antibodies.', dataSource: 'CDC NS3' },
    { id: 'us2', strainName: 'SARS-CoV-2 (KP.3)', location: 'National', significance: 'Increased Transmissibility', summary: 'A FLiRT variant rapidly becoming dominant, though severity appears unchanged.', dataSource: 'GISAID' },
  ],
  biological: [
    { agent: 'B. anthracis Spores', signatureType: 'Genomic', location: 'Washington D.C. Metro', status: 'Trending', signalStrength: 350, sourceType: 'Aerosol Sampler' },
    { agent: 'Botulinum Toxin', signatureType: 'Protein', location: 'Denver Water Reservoir', status: 'Confirmed', signalStrength: 980, sourceType: 'Water Reservoir' },
  ],
  chemical: [
    { agent: 'Sarin (GB)', signatureType: 'Mass Spec', location: 'New York City Subway', status: 'Confirmed', concentration: 25, sourceType: 'Air Quality Sensor' },
    { agent: 'Chlorine Gas', signatureType: 'Sensor Network', location: 'Port of Los Angeles', status: 'Trending', concentration: 8, sourceType: 'Air Quality Sensor' },
  ],
  slaughterhouses: [
    { id: 'us_sh_1', location: 'Omaha, NE Processing Plant', hygieneScore: 65, pathogensDetected: ['Listeria monocytogenes'], riskLevel: 'Moderate' },
    { id: 'us_sh_2', location: 'Greeley, CO Facility', hygieneScore: 52, pathogensDetected: ['E. coli O157:H7', 'Salmonella'], riskLevel: 'High' },
  ],
};

const nationalDataUS = {
  country: 'US',
  kpiData: [
    { title: 'New Cases (24h)', value: '14,289', change: '+5.2% vs yesterday', changeType: 'increase' },
    { title: 'Population at Risk', value: '12.5M', change: '-1.8% vs last week', changeType: 'decrease' },
    { title: 'Active Hotspots', value: '42', change: '+3 since last report', changeType: 'increase' },
  ],
  oneHealthData: oneHealthIndexDataUS,
  biowarfareThreats: [
    { id: 'bw1', agent: 'Weaponized Anthrax (B. anthracis)', agentType: 'Bacterial', origin: 'State-Sponsored', lethality: 9, status: 'Credible Intel', countermeasures: 'Vaccine Available', summaryPrompt: 'Analyze the strategic threat of an aerosolized release of weaponized Anthrax in a major US metropolitan area. Focus on initial casualty estimates and the critical window for antibiotic distribution.' },
    { id: 'bw2', agent: 'Engineered H5N1 (Avian Flu)', agentType: 'Viral', origin: 'Non-State Actor', lethality: 8, status: 'Pre-emptive Warning', countermeasures: 'Limited', summaryPrompt: 'Analyze the strategic threat of an engineered H5N1 strain with enhanced human-to-human transmissibility. Focus on its pandemic potential and the strain on global vaccine production.' },
    { id: 'bw3', agent: 'Ricin Toxin', agentType: 'Toxin', origin: 'Unknown', lethality: 7, status: 'Credible Intel', countermeasures: 'None', summaryPrompt: 'Analyze the strategic threat of Ricin toxin dissemination through a contaminated food supply chain. Focus on the difficulty of early detection and the potential for mass casualties before a source is identified.' },
  ],
  nationalLabNetworkStatus: [
    { id: 'lab1', name: 'USAMRIID', location: 'Fort Detrick, MD', bsl: 4, status: 'High-Alert' },
    { id: 'lab2', name: 'CDC IRF', location: 'Atlanta, GA', bsl: 4, status: 'Nominal' },
    { id: 'lab3', name: 'Galveston National Lab', location: 'Galveston, TX', bsl: 4, status: 'Surge Capacity' },
    { id: 'lab4', name: 'NEIDL, Boston University', location: 'Boston, MA', bsl: 4, status: 'Nominal' },
    { id: 'lab5', name: 'RML, NIAID', location: 'Hamilton, MT', bsl: 3, status: 'Nominal' },
  ],
  nationalBiosecurityIndexData: {
    score: 82, level: 'High', breakdown: {
        intel: { score: 85, contextPrompt: 'Analyze the current intelligence landscape for bio-threats against the US. The current score is 85/100, indicating high risk. Focus on the implications of high-volume chatter from non-state actors regarding B. anthracis.' },
        labReadiness: { score: 75, contextPrompt: 'Assess the US BSL-4 lab network readiness. The score is 75/100. While key labs are on high-alert, network-wide surge capacity activation is lagging. What are the primary vulnerabilities?' },
        countermeasures: { score: 60, contextPrompt: 'Evaluate the US Strategic National Stockpile\'s readiness. The score is 60/100, indicating a significant gap. Focus on the risk posed by limited novel antiviral and antitoxin supplies versus the adequate antibiotic reserves.' },
        populationVulnerability: { score: 90, contextPrompt: 'Analyze the US population\'s vulnerability to an aerosolized bio-threat. The score is 90/100, indicating extreme vulnerability. Focus on high population density in coastal megacities as the primary risk factor.' },
    }
  },
  trendData: {
    respiratory: [
        { name: '8w ago', value: 1200 }, { name: '7w ago', value: 1500 }, { name: '6w ago', value: 1400 }, { name: '5w ago', value: 1800 }, { name: '4w ago', value: 2200 }, { name: '3w ago', value: 2500 }, { name: '2w ago', value: 3100 }, { name: 'Last week', value: 3500 }, { name: 'This week', value: 4200 },
    ],
    gastrointestinal: [
        { name: '8w ago', value: 800 }, { name: '7w ago', value: 900 }, { name: '6w ago', value: 850 }, { name: '5w ago', value: 1100 }, { name: '4w ago', value: 1000 }, { name: '3w ago', value: 1200 }, { name: '2w ago', value: 1300 }, { name: 'Last week', value: 1150 }, { name: 'This week', value: 1250 },
    ]
  },
  alerts: [
    { id: 1, title: 'Unseasonal Influenza A Spike', location: 'Miami-Dade County, FL', timestamp: '2 hours ago', severity: 'Critical', date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 2, title: 'Multi-facility Norovirus Outbreak', location: 'Houston, TX', timestamp: '8 hours ago', severity: 'High', date: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString() },
    { id: 3, title: 'Increased RSV cases in Pediatrics', location: 'New York City, NY', timestamp: '1 day ago', severity: 'Moderate', date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 4, title: 'Possible Measles Exposure Event', location: 'Los Angeles Int\'l Airport', timestamp: '2 days ago', severity: 'High', date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  ],
  aiSummary: `- **Overall Trend:** National cases up 5.2% (24h), driven by respiratory illnesses.\n- **Influenza A (H3N2):** Major spike in FL, CA, WA (+25% week-over-week).\n- **Norovirus:** Significant outbreak in TX (+40% vs baseline).\n- **RSV:** Rising pediatric cases in NY & IL.\n- **Hotspots:** 42 active national hotspots, with 3 new in major cities.`,
  threatSpectrumData: [
    { name: 'Influenza A (H3N2)', threatLevel: 85, trend: 'increasing', summaryPrompt: 'Provide a one-sentence summary of the current threat from Influenza A (H3N2) in the USA, focusing on its high prevalence in the Southeast.' },
    { name: 'Norovirus', threatLevel: 70, trend: 'increasing', summaryPrompt: 'Provide a one-sentence summary of the current threat from Norovirus GII.4 in the USA, noting its rapid spread in Texas.' },
    { name: 'RSV', threatLevel: 60, trend: 'stable', summaryPrompt: 'Provide a one-sentence summary of the current threat from Respiratory Syncytial Virus (RSV) in the USA, highlighting its impact on pediatric populations in the Northeast.' },
    { name: 'Influenza B', threatLevel: 45, trend: 'decreasing', summaryPrompt: 'Provide a one-sentence summary of the current threat from Influenza B in the USA, mentioning its waning case numbers post-peak season.' }
  ],
  mapData: [
    { id: 'CA', name: 'California', value: 2500, dominantPathogen: 'Influenza A (H3N2)' }, { id: 'TX', name: 'Texas', value: 1800, dominantPathogen: 'Norovirus' }, { id: 'FL', name: 'Florida', value: 2100, dominantPathogen: 'Influenza A (H3N2)' }, { id: 'NY', name: 'New York', value: 1500, dominantPathogen: 'RSV' }, { id: 'IL', name: 'Illinois', value: 900, dominantPathogen: 'RSV' }, { id: 'PA', name: 'Pennsylvania', value: 850, dominantPathogen: 'Influenza B' }, { id: 'OH', name: 'Ohio', value: 700, dominantPathogen: 'Norovirus' }, { id: 'GA', name: 'Georgia', value: 1100, dominantPathogen: 'Influenza A (H3N2)' }, { id: 'NC', name: 'North Carolina', value: 950, dominantPathogen: 'Influenza A (H3N2)' }, { id: 'MI', name: 'Michigan', value: 600, dominantPathogen: 'RSV' }, { id: 'WA', name: 'Washington', value: 1300, dominantPathogen: 'Influenza A (H3N2)' }, { id: 'AZ', name: 'Arizona', value: 1400, dominantPathogen: 'Norovirus' },
  ]
};

// --- INDIA DATA ---
const oneHealthIndexDataIndia = {
  human: { newCases: 8124, newCasesChange: 8.1, activeHotspots: 112, hospitalizationRate: 15.5, icuRate: 4.2 },
  zoonotic: [
    { name: 'Nipah Virus (NiV)', location: 'Bat colonies, Kerala', risk: 'Critical', interfaceProximity: 'Direct' },
    { name: 'Avian Influenza (H5N1)', location: 'Poultry farms, West Bengal', risk: 'High', interfaceProximity: 'Direct' },
  ],
  environmental: [
    { name: 'Vibrio cholerae', location: 'Kolkata Waterways', status: 'Confirmed' },
    { name: 'Dengue RNA', location: 'Chennai Sentinel Site', status: 'Trending', signalStrength: 210 },
  ],
  livestock: [
    { disease: 'Avian Influenza (HPAI)', species: 'Poultry', riskLevel: 'High', economicImpact: 'High' },
    { disease: 'Foot and Mouth Disease (FMD)', species: 'Cattle', riskLevel: 'High', economicImpact: 'High' },
    { disease: 'Peste des Petits Ruminants (PPR)', species: 'Goat/Sheep', riskLevel: 'Moderate', economicImpact: 'Moderate' },
  ],
  wildlife: [
    { species: 'Asiatic Lions', disease: 'Canine Distemper Virus (CDV)', location: 'Gir Forest, Gujarat', riskToHumans: 'Low', potentialImpact: 'Threat to endangered species conservation.' },
    { species: 'Indian Flying Fox', disease: 'Kyasanur Forest Disease (KFD)', location: 'Western Ghats, Karnataka', riskToHumans: 'High', potentialImpact: 'Known zoonotic pathogen with severe human symptoms.' },
  ],
  disasters: [
    { disasterType: 'Flood', location: 'Brahmaputra Basin, Assam', severity: 'Major', associatedDiseaseRisks: ['Cholera', 'Typhoid', 'Leptospirosis', 'Japanese Encephalitis'] },
    { disasterType: 'Drought', location: 'Marathwada, Maharashtra', severity: 'Major', associatedDiseaseRisks: ['Malnutrition', 'Water-borne diseases from contaminated sources'] },
  ],
  vaccineInventory: [
    { name: 'DengueShield (Inactivated)', targetPathogen: 'Dengue (All Serotypes)', type: 'Inactivated', dosesAvailable: 25000000, monthlyProductionCapacity: 8000000, efficacy: 85, wastageRate: 10 },
    { name: 'BharatChol (Oral)', targetPathogen: 'Vibrio cholerae', type: 'Oral', dosesAvailable: 50000000, monthlyProductionCapacity: 20000000, efficacy: 90, wastageRate: 7 },
    { name: 'NipahGuard (mRNA)', targetPathogen: 'Nipah Virus (NiV)', type: 'mRNA', dosesAvailable: 500000, monthlyProductionCapacity: 100000, efficacy: 95, wastageRate: 15 },
  ],
  genomic: [
    { id: 'in1', strainName: 'DENV-2 - Cosmopolitan Genotype', location: 'Kerala, Tamil Nadu', significance: 'Increased Severity', summary: 'Specific mutations linked to higher incidence of Dengue Hemorrhagic Fever (DHF).', dataSource: 'INSACOG' },
    { id: 'in2', strainName: 'Nipah Virus (NiV) - Bangladesh Genotype', location: 'Kozhikode, Kerala', significance: 'Under Monitoring', summary: 'Genotype confirmed from bat surveillance; matches previous human outbreak strains.', dataSource: 'NIV Pune' },
  ],
  biological: [
    { agent: 'Weaponized Nipah DNA', signatureType: 'Genomic', location: 'Kochi Port Aerosol Sampler', status: 'Trending', signalStrength: 420, sourceType: 'Aerosol Sampler' },
    { agent: 'Brucella suis', signatureType: 'Genomic', location: 'Punjab Water Reservoir', status: 'Confirmed', signalStrength: 850, sourceType: 'Water Reservoir' },
  ],
  chemical: [
    { agent: 'VX Nerve Agent', signatureType: 'Mass Spec', location: 'Delhi Lutyens Zone Air Sensor', status: 'Confirmed', concentration: 15, sourceType: 'Air Quality Sensor' },
    { agent: 'Phosgene Gas', signatureType: 'Sensor Network', location: 'Mumbai Port Authority', status: 'Trending', concentration: 12, sourceType: 'Air Quality Sensor' },
  ],
  slaughterhouses: [
    { id: 'in_sh_1', location: 'Ghazipur Murga Mandi, Delhi', hygieneScore: 45, pathogensDetected: ['Avian Influenza RNA', 'Campylobacter'], riskLevel: 'High' },
    { id: 'in_sh_2', location: 'Deonar Abattoir, Mumbai', hygieneScore: 58, pathogensDetected: ['Brucella antibodies', 'Q fever'], riskLevel: 'High' },
  ],
};

const nationalDataIndia = {
    country: 'India',
    kpiData: [
        { title: 'New Dengue Cases (24h)', value: '8,124', change: '+8.1% vs yesterday', changeType: 'increase',
            details: { type: 'trend_prediction', summary: 'Recent case data indicates a surge in DENV-2 serotype. However, genomic sequencing confirms the current strain is associated with milder symptoms, and mutations linked to Dengue Hemorrhagic Fever are absent.', data: [ { name: 'Day -6', value: 7500 }, { name: 'Day -5', value: 7650 }, { name: 'Day -4', value: 7800 }, { name: 'Day -3', value: 7950 }, { name: 'Day -2', value: 8000 }, { name: 'Day -1', value: 8050 }, { name: 'Today', value: 8124 }, ], prediction: { name: 'Tomorrow', value: 8200 }, }
        },
        { title: 'Population at Risk', value: '45.2M', change: '+3.5% vs last week', changeType: 'increase',
            details: { type: 'population_risk', data: [ { location: 'Kerala', population: '8.2M', riskLevel: 'Critical' }, { location: 'Maharashtra', population: '12.5M', riskLevel: 'High' }, { location: 'West Bengal', population: '9.8M', riskLevel: 'High' }, { location: 'Tamil Nadu', population: '7.1M', riskLevel: 'Moderate' }, { location: 'Delhi (NCT)', population: '5.5M', riskLevel: 'Moderate' }, ] }
        },
        { title: 'Active Hotspots', value: '112', change: '+12 since last report', changeType: 'increase',
            details: { type: 'hotspots', data: [ { location: 'Kochi, Kerala', details: 'Severe DENV-2 outbreak in urban areas.', localBody: 'Kochi Municipal Corporation Health Dept.' }, { location: 'Kolkata, West Bengal', details: 'Cholera cluster linked to water sources.', localBody: 'Kolkata Municipal Corporation, Water Supply Dept.' }, { location: 'Mumbai, Maharashtra', details: 'High vector density reported in suburbs.', localBody: 'Brihanmumbai Municipal Corporation, Pest Control Office' }, { location: 'Chennai, Tamil Nadu', details: 'Wastewater shows high Dengue RNA signal.', localBody: 'Greater Chennai Corporation, Public Health Dept.' } ] }
        },
    ],
    oneHealthData: oneHealthIndexDataIndia,
    biowarfareThreats: [
      { id: 'bw-in-1', agent: 'Weaponized Nipah Virus (NiV)', agentType: 'Viral', origin: 'Non-State Actor', lethality: 9, status: 'Credible Intel', countermeasures: 'Limited', summaryPrompt: 'Analyze the strategic threat of an aerosolized release of a weaponized Nipah Virus strain in a high-density Indian city. Focus on the high mortality rate, lack of specific treatment, and potential for rapid spread.' },
      { id: 'bw-in-2', agent: 'Contaminated Water Supply (V. cholerae)', agentType: 'Bacterial', origin: 'Unknown', lethality: 6, status: 'Pre-emptive Warning', countermeasures: 'Treatment Available', summaryPrompt: 'Analyze the strategic threat of deliberate contamination of a major river system with a multi-drug resistant Cholera strain. Focus on the speed of outbreak and the strain on public health infrastructure.' },
      { id: 'bw-in-3', agent: 'Agricultural Bioterrorism (Wheat Blast)', agentType: 'Toxin', origin: 'State-Sponsored', lethality: 1, status: 'Credible Intel', countermeasures: 'Limited', summaryPrompt: 'Analyze the strategic threat of an intentional introduction of Wheat Blast fungus (Magnaporthe oryzae) to impact food security in the Indo-Gangetic Plain. Focus on economic impact and civil unrest potential.' },
    ],
    nationalLabNetworkStatus: [
      { id: 'lab-in-1', name: 'NIV, Pune', location: 'Pune, MH', bsl: 4, status: 'High-Alert' }, { id: 'lab-in-2', name: 'DRDE, Gwalior', location: 'Gwalior, MP', bsl: 4, status: 'Nominal' }, { id: 'lab-in-3', name: 'NIHSAD, Bhopal', location: 'Bhopal, MP', bsl: 4, status: 'Nominal' }, { id: 'lab-in-4', name: 'CCMB, Hyderabad', location: 'Hyderabad, TS', bsl: 3, status: 'Surge Capacity' }, { id: 'lab-in-5', name: 'NICED, Kolkata', location: 'Kolkata, WB', bsl: 3, status: 'High-Alert' },
    ],
    nationalBiosecurityIndexData: {
      score: 74, level: 'High', breakdown: {
          intel: { score: 80, contextPrompt: 'Analyze the current intelligence landscape for bio-threats against India. The score is 80/100. Focus on the implications of elevated chatter from regional non-state actors showing interest in zoonotic agents like Nipah virus.' },
          labReadiness: { score: 70, contextPrompt: 'Assess India\'s BSL-4 lab network readiness. The score is 70/100. The primary labs are operational, but what are the key risks associated with national surge capacity limitations and sample transport logistics?' },
          countermeasures: { score: 65, contextPrompt: 'Evaluate India\'s national countermeasure readiness. The score is 65/100. The country has strong vaccine production infrastructure for known diseases, but what is the strategic risk of having limited stockpiles of broad-spectrum antivirals for novel threats?' },
          populationVulnerability: { score: 85, contextPrompt: 'Analyze India\'s population vulnerability to a contagious biological agent. The score is 85/100, indicating very high vulnerability. Focus on extreme population density in megacities as the critical risk multiplier.' },
      }
    },
    trendData: {
        dengue: [ { name: '8w ago', value: 2100 }, { name: '7w ago', value: 2500 }, { name: '6w ago', value: 3400 }, { name: '5w ago', value: 3800 }, { name: '4w ago', value: 4200 }, { name: '3w ago', value: 5500 }, { name: '2w ago', value: 6100 }, { name: 'Last week', value: 7500 }, { name: 'This week', value: 8124 }, ],
        cholera: [ { name: '8w ago', value: 500 }, { name: '7w ago', value: 650 }, { name: '6w ago', value: 700 }, { name: '5w ago', value: 900 }, { name: '4w ago', value: 1100 }, { name: '3w ago', value: 1050 }, { name: '2w ago', value: 1300 }, { name: 'Last week', value: 1450 }, { name: 'This week', value: 1550 }, ]
    },
    alerts: [
        { id: 1, title: 'Severe Dengue Outbreak', location: 'Kochi, Kerala', timestamp: '4 hours ago', severity: 'Critical', date: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), },
        { id: 2, title: 'Cholera Cluster Detected', location: 'Kolkata, West Bengal', timestamp: '12 hours ago', severity: 'High', date: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), },
        { id: 3, title: 'Suspected Malaria Spike', location: 'Mumbai, Maharashtra', timestamp: '2 days ago', severity: 'High', date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), },
        { id: 4, title: 'Increase in Acute Diarrheal Disease', location: 'Patna, Bihar', timestamp: '3 days ago', severity: 'Moderate', date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), },
    ],
    aiSummary: `- **Overall Trend:** National Dengue cases up 8.1% (24h) during peak monsoon.\n- **Dengue (DENV-2):** Critical outbreak in Kerala; serotype linked to severe disease. High case counts also in MH & KA.\n- **Cholera:** Significant cluster in West Bengal linked to contaminated water post-flooding.\n- **Hotspots:** 112 active national hotspots (+12 in 24h), mostly in dense urban areas.`,
    threatSpectrumData: [
        { name: 'Dengue (DENV-2)', threatLevel: 92, trend: 'increasing', summaryPrompt: 'Provide a one-sentence summary of the current threat from Dengue serotype DENV-2 in India, focusing on the severe outbreak in Kerala.' },
        { name: 'Vibrio cholerae', threatLevel: 80, trend: 'increasing', summaryPrompt: 'Provide a one-sentence summary of the current threat from Vibrio cholerae in India, highlighting the cluster in West Bengal linked to contaminated water.' },
        { name: 'Malaria (P. falciparum)', threatLevel: 65, trend: 'stable', summaryPrompt: 'Provide a one-sentence summary of the current threat from Plasmodium falciparum malaria in India, noting its endemic presence in eastern states.' },
        { name: 'Chikungunya', threatLevel: 50, trend: 'stable', summaryPrompt: 'Provide a one-sentence summary of the current threat from Chikungunya virus in India, mentioning sporadic cases reported nationwide.' }
    ],
    mapData: [
        { id: 'KL', name: 'Kerala', value: 3200, dominantPathogen: 'DENV-2 Serotype' }, { id: 'MH', name: 'Maharashtra', value: 2800, dominantPathogen: 'DENV-1 Serotype' }, { id: 'WB', name: 'West Bengal', value: 2900, dominantPathogen: 'Vibrio cholerae' }, { id: 'TN', name: 'Tamil Nadu', value: 2200, dominantPathogen: 'DENV-3 Serotype' }, { id: 'DL', name: 'Delhi', value: 1800, dominantPathogen: 'DENV-2 Serotype' }, { id: 'KA', name: 'Karnataka', value: 1900, dominantPathogen: 'DENV-1 Serotype' }, { id: 'UP', name: 'Uttar Pradesh', value: 1500, dominantPathogen: 'Vibrio cholerae' }, { id: 'GJ', name: 'Gujarat', value: 1200, dominantPathogen: 'DENV-4 Serotype' }, { id: 'MP', name: 'Madhya Pradesh', value: 1700, dominantPathogen: 'P. falciparum Malaria' },
    ],
};

const detailedStateData = { /* Omitted for brevity, but it's the full nested object from stateData.ts */ };
const allSurveillanceData = { /* Omitted for brevity, from surveillanceData.ts */ };

const threatSignalData = {
  biologicalSignals: {
    US: oneHealthIndexDataUS.biological,
    India: oneHealthIndexDataIndia.biological
  },
  chemicalSignals: {
    US: oneHealthIndexDataUS.chemical,
    India: oneHealthIndexDataIndia.chemical
  }
};

module.exports = {
  nationalDataUS,
  nationalDataIndia,
  detailedStateData,
  allSurveillanceData,
  threatSignalData
};

