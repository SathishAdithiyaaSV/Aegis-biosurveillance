import React from 'react';

export interface PopulationRiskItem {
  location: string;
  population: string;
  riskLevel: 'Critical' | 'High' | 'Moderate';
}

export interface HotspotItem {
  location:string;
  details: string;
  localBody: string;
}

export type KpiDetails = 
  | { type: 'trend_prediction'; data: TimeSeriesData[]; prediction: TimeSeriesData; summary: string; }
  | { type: 'population_risk'; data: PopulationRiskItem[]; }
  | { type: 'hotspots'; data: HotspotItem[]; };

export interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  details?: KpiDetails;
}

export interface TimeSeriesData {
  name: string;
  value: number;
}

export interface MapPath {
  id: string;
  name: string;
  d: string;
}

export interface StateData {
  id: string; // e.g., 'AL'
  name: string; // e.g., 'Alabama'
  value: number; // e.g., number of cases
  dominantPathogen?: string;
}

export interface Alert {
    id: number;
    title: string;
    location: string;
    timestamp: string;
    severity: 'Critical' | 'High' | 'Moderate';
    date: string; // ISO date string for sorting
}

export interface Threat {
  name: string;
  threatLevel: number; // 0-100
  trend: 'increasing' | 'decreasing' | 'stable';
  summaryPrompt: string;
}

// --- ONE HEALTH INDEX TYPES ---
export type RiskLevel = 'Critical' | 'High' | 'Moderate' | 'Low' | 'None';

export interface MetricBreakdown {
    metric: string;
    value: string;
    score: number;
    maxScore: number;
    reasoning: string;
}

export interface HumanHealthData {
  newCases: number;
  newCasesChange: number; // percentage
  activeHotspots: number;
  hospitalizationRate: number; // percentage
  icuRate: number; // percentage
}

export interface ZoonoticAlert {
  name: string;
  location: string;
  risk: RiskLevel;
  interfaceProximity: 'Direct' | 'High' | 'Moderate' | 'Low'; // Proximity to human populations
  primaryVector?: string;
}

export interface EnvironmentalAlert {
  name: string;
  location: string;
  status: 'Confirmed' | 'Trending';
  signalStrength?: number; // e.g., 150 for +150%
  sourceType?: 'Wastewater' | 'Floodwater' | 'Zoonotic Wastewater';
}

export interface OneHealthIndexBreakdown {
  human: {
    score: number;
    breakdown: MetricBreakdown[];
  };
  zoonotic: {
    score: number;
    breakdown: MetricBreakdown[];
  };
  environmental: {
    score: number;
    breakdown: MetricBreakdown[];
  };
}

export interface OneHealthIndexData {
  score: number;
  level: RiskLevel;
  breakdown: OneHealthIndexBreakdown;
}


// --- STATE-SPECIFIC TYPES ---

export interface ViralGenomicsData {
    dominantStrain: string;
    viralLoad: number; // A normalized score 0-100
    viralLoadChange: number; // percentage change
    strainSummaryPrompt: string;
    dataSource: string;
}

export interface DataSource {
    name: string;
    credibility: number; // A score out of 100
    bias: 'Low' | 'Moderate' | 'High';
}

export type HealthcareWorkerStatus = 'Strained' | 'Adequate' | 'Overwhelmed';

export interface StateProfile {
    population: string;
    populationDensity: string;
    climate: string;
    geography: string;
    hygieneIndex: number; // A score out of 100
    dataSources: DataSource[];
    healthcareCapacity?: {
        icuBedsAvailable: string;
        ventilatorsAvailable: string;
        healthcareWorkerStatus: HealthcareWorkerStatus;
    };
    publicHealthResponse?: {
        testingRatePer1000: number;
        contactTracingEfficiency: number; // percentage
    };
    socioeconomicFactors?: {
        urbanizationLevel: number; // percentage
        literacyRate: number; // percentage
    }
}

export interface StateKpi extends Omit<Kpi, 'icon' | 'details'> {
    // State KPIs are simpler and don't need icons in the new design
}

export interface StateAlert extends Omit<Alert, 'location'> {
    // Location is implicit in the state dashboard
    district: string;
}

export interface DrugInventoryItem {
    name: string;
    stock: number; // units
    burnRate: number; // units per day
    category: 'Antiviral' | 'Analgesic' | 'IV Fluid' | 'Medical Supply' | 'Antibiotic';
}

export interface VaccineInventoryItem {
    name: string;
    targetPathogen: string;
    type: 'mRNA' | 'Viral Vector' | 'Inactivated' | 'Subunit' | 'Oral';
    dosesAvailable: number;
    monthlyProductionCapacity: number;
    efficacy: number; // percentage
    wastageRate: number; // percentage
}


// --- DISTRICT-SPECIFIC TYPES ---
export interface DistrictProfile {
    population: string;
    geography: string;
    hospitals: number;
    healthcareEffectiveness: 'High' | 'Moderate' | 'Low';
    climaticZones: number;
    prevalentDiseases: string[];
}

export interface DistrictKpi extends Omit<Kpi, 'icon' | 'details'> {}

export interface DistrictAlert extends Omit<Alert, 'location' | 'district'> {
    // Location and district are implicit in the district dashboard
}

export interface LocalEnvironmentalSignal {
    id: number;
    description: string;
    sourceType: 'Water Source' | 'Market' | 'Event' | 'Community Report' | 'Zoonotic Wastewater' | 'Water Management';
    imageUrl?: string;
    highlight?: boolean;
}

export interface DistrictHospitalData {
    bedOccupancy: number; // percentage
    icuOccupancy: number; // percentage
    ventilatorAvailability: number; // percentage
    staffStatus: HealthcareWorkerStatus;
}

export interface DistrictSurveillanceData {
    vectorDensityIndex: 'High' | 'Moderate' | 'Low';
    feverSurveyReports: number;
    localEnvironmentalSignals: LocalEnvironmentalSignal[];
}

export interface DistrictData {
    id: string;
    name: string;
    value: number; // Case count for map coloring
    profile: DistrictProfile;
    kpis: DistrictKpi[];
    alerts: DistrictAlert[];
    hospitalData: DistrictHospitalData;
    surveillanceData: DistrictSurveillanceData;
    drugInventory: DrugInventoryItem[];
    aiSummary: string;
}


export interface DetailedStateData {
    id: string;
    name: string;
    profile: StateProfile;
    kpis: StateKpi[];
    alerts: StateAlert[];
    trendData: TimeSeriesData[];
    viralGenomics: ViralGenomicsData;
    aiSummary: string;
    districts: DistrictData[];
    districtPaths: MapPath[];
    drugInventory: DrugInventoryItem[];
    vaccineInventory: VaccineInventoryItem[];
    zoonoticAlerts?: ZoonoticAlert[];
    environmentalAlerts?: EnvironmentalAlert[];
}

// --- NEW ONE HEALTH MODULES ---

export interface WildlifeAlert {
  species: string;
  disease: string;
  location: string;
  riskToHumans: 'High' | 'Moderate' | 'Low' | 'Unknown';
  potentialImpact: string;
}

export interface DisasterAlert {
  disasterType: 'Flood' | 'Hurricane' | 'Wildfire' | 'Earthquake' | 'Drought';
  location: string;
  severity: 'Catastrophic' | 'Major' | 'Moderate';
  associatedDiseaseRisks: string[];
}
