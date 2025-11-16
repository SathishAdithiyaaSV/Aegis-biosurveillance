import React, { useState, useMemo, useEffect } from 'react';
import KpiCard from './KpiCard';
import MapChart from './MapChart';
import AlertsPanel from './AlertsPanel';
import AiAnalysisPanel from './AiAnalysisPanel';
import ThreatSpectrum from './ThreatSpectrum';
import ZoonoticSurveillancePanel from './ZoonoticSurveillancePanel';
import EnvironmentalPanel from './EnvironmentalPanel';
import StateDashboard from './StateDashboard';
import ZoonoticDetailModal from './ZoonoticDetailModal';
import WastewaterDetailModal from './WastewaterDetailModal';
import ExpandableKpiCard from './ExpandableKpiCard';
import WildlifeSurveillancePanel from './WildlifeSurveillancePanel';
import DisasterResponsePanel from './DisasterResponsePanel';
import WildlifeDetailModal from './WildlifeDetailModal';
import DisasterDetailModal from './DisasterDetailModal';
import VaccineOptimizationPanel from './VaccineOptimizationPanel';
import EmergencyResponsePanel from './EmergencyResponsePanel';
import MonitoringPanel from './MonitoringPanel';
import GenomicSurveillancePanel from './GenomicSurveillancePanel';
import GenomicDetailModal from './GenomicDetailModal';
import LivestockSurveillancePanel from './LivestockSurveillancePanel';
import LivestockDetailModal from './LivestockDetailModal';
import SlaughterhouseDetailModal from './SlaughterhouseDetailModal';
import ChemicalWeaponPanel from './ChemicalWeaponPanel';
import ChemicalWeaponDetailModal from './ChemicalWeaponDetailModal';
import LivestockVaccinationPanel from './LivestockVaccinationPanel';
import { INDIA_STATE_PATHS } from './constants';
import { ZoonoticAlert, EnvironmentalAlert, WildlifeAlert, DisasterAlert, EscalatedAlert, GenomicSignal, LivestockAlert, SurveillanceType, LivestockVaccinationStats, SlaughterhouseData, ChemicalWeaponSignal, Kpi } from '../types';
import OneHealthIndexPanel from './OneHealthIndexPanel';
import { calculateOneHealthIndex } from '../services/oneHealthService';
import BiosecurityDashboard from './BiosecurityDashboard';
import ModuleCard from './ModuleCard';
import SurveillanceMapView from './surveillance/SurveillanceMapView';
import { ComponentLoader } from './shared/common';
import TrendChart from './TrendChart';

interface DashboardIndiaProps {
  activeAlert: EscalatedAlert | null;
  onEscalate: (alert: EscalatedAlert) => void;
  onAcknowledge: (alert: EscalatedAlert) => void;
  onResolve: () => void;
}

const BiohazardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.33,14.25a.75.75,0,0,1,0-1.5,1.5,1.5,0,0,0,1.5-1.5.75.75,0,0,1,1.5,0,3,3,0,0,1-3,3Z"/>
      <path d="M8.67,14.25a3,3,0,0,1-3-3,.75.75,0,0,1,1.5,0,1.5,1.5,0,0,0,1.5,1.5.75.75,0,0,1,0,1.5Z"/>
      <path d="M12,12.75a.75.75,0,0,1-.75-.75V8.25a.75.75,0,0,1,1.5,0v3.75A.75.75,0,0,1,12,12.75Z"/>
      <path d="M12,21.75a4.5,4.5,0,0,1-4.32-3.2.75.75,0,0,1,1.45-.4,3,3,0,0,0,5.74,0,.75.75,0,0,1,1.45.4A4.5,4.5,0,0,1,12,21.75Z"/>
      <path d="M19.32,18.15a.75.75,0,0,1-.66-.94,3,3,0,0,0-1.2-2.36.75.75,0,1,1,.9-1.2,4.5,4.5,0,0,1,1.8,3.56A.75.75,0,0,1,19.32,18.15Z"/>
      <path d="M4.68,18.15a.75.75,0,0,1-.84-1,4.5,4.5,0,0,1,1.8-3.56.75.75,0,1,1,.9,1.2,3,3,0,0,0-1.2,2.36A.75.75,0,0,1,4.68,18.15Z"/>
      <path d="M12,6.75A4.5,4.5,0,0,1,7.5,2.25a.75.75,0,0,1,0,1.5,3,3,0,0,0,0,6A.75.75,0,0,1,7.5,8.25,4.5,4.5,0,0,1,12,6.75Z"/>
      <path d="M12,6.75A4.5,4.5,0,0,0,16.5,2.25a.75.75,0,0,1,0-1.5,3,3,0,0,1,0,6,.75.75,0,0,1,0-1.5A4.5,4.5,0,0,0,12,6.75Z"/>
      <path d="M12,12.75a4.5,4.5,0,0,1-4.27-2.92.75.75,0,0,1,1.4-.56,3,3,0,0,0,5.74,0,.75.75,0,0,1,1.4.56A4.5,4.5,0,0,1,12,12.75Z"/>
    </svg>
);

const DashboardIndia: React.FC<DashboardIndiaProps> = ({ activeAlert, onEscalate, onAcknowledge, onResolve }) => {
  const [nationalData, setNationalData] = useState<any>(null);
  const [allSurveillanceData, setAllSurveillanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [zoonoticDetail, setZoonoticDetail] = useState<ZoonoticAlert | null>(null);
  const [wastewaterDetail, setWastewaterDetail] = useState<EnvironmentalAlert | null>(null);
  const [wildlifeDetail, setWildlifeDetail] = useState<WildlifeAlert | null>(null);
  const [disasterDetail, setDisasterDetail] = useState<DisasterAlert | null>(null);
  const [genomicDetail, setGenomicDetail] = useState<GenomicSignal | null>(null);
  const [livestockDetail, setLivestockDetail] = useState<LivestockAlert | null>(null);
  const [slaughterhouseDetail, setSlaughterhouseDetail] = useState<SlaughterhouseData | null>(null);
  const [chemicalDetail, setChemicalDetail] = useState<ChemicalWeaponSignal | null>(null);
  const [showBiosecurityModule, setShowBiosecurityModule] = useState(false);
  const [activeSurveillanceLayer, setActiveSurveillanceLayer] = useState<SurveillanceType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [nationalRes, surveillanceRes] = await Promise.all([
          fetch('http://localhost:5000/api/national/INDIA'),
          fetch('http://localhost:5000/api/surveillance/all')
        ]);

        if (!nationalRes.ok) throw new Error(`Failed to fetch national data: ${nationalRes.statusText}`);
        if (!surveillanceRes.ok) throw new Error(`Failed to fetch surveillance data: ${surveillanceRes.statusText}`);
        
        const national = await nationalRes.json();
        const surveillance = await surveillanceRes.json();
        
        setNationalData(national);
        setAllSurveillanceData(surveillance);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const oneHealthIndex = useMemo(() => {
    if (!nationalData) return null;
    return calculateOneHealthIndex(
      nationalData.oneHealthData.human,
      nationalData.oneHealthData.zoonotic,
      nationalData.oneHealthData.environmental
    );
  }, [nationalData]);

  const nationalLivestockVaccinationStats = useMemo(() => {
    if (!allSurveillanceData) return [];
    const stats: { [key: string]: LivestockVaccinationStats } = {};
    const livestockData = allSurveillanceData.livestock;

    for (const stateId in livestockData) {
        const stateData = livestockData[stateId];
        stateData.vaccinationStats.forEach((stat: LivestockVaccinationStats) => {
            if (!stats[stat.species]) {
                stats[stat.species] = {
                    species: stat.species,
                    vaccinated: 0,
                    total: 0,
                    targetDiseases: [],
                };
            }
            stats[stat.species].vaccinated += stat.vaccinated;
            stats[stat.species].total += stat.total;
            const existingDiseases = new Set(stats[stat.species].targetDiseases.concat(stat.targetDiseases));
            stats[stat.species].targetDiseases = Array.from(existingDiseases);
        });
    }
    return Object.values(stats);
  }, [allSurveillanceData]);

  const handleStateSelect = (stateId: string) => {
    setSelectedStateId(stateId);
  };

  const handleBackToNational = () => {
    setSelectedStateId(null);
  };

  const nationalCriticalAlert = useMemo(() => {
    return nationalData?.alerts.find((a: any) => a.severity === 'Critical');
  }, [nationalData]);

  const emergencyAlertToShow = useMemo(() => {
    if (activeAlert?.status === 'escalated' && (activeAlert.level === 'State' || activeAlert.level === 'National')) {
      return activeAlert;
    }
    if (!activeAlert && nationalCriticalAlert) {
      return {
        level: 'National' as 'National',
        from: 'National Surveillance',
        alert: nationalCriticalAlert,
        status: 'escalated' as 'escalated',
      };
    }
    return null;
  }, [activeAlert, nationalCriticalAlert]);

  const monitoringAlertToShow = useMemo(() => {
    if (activeAlert?.status === 'monitoring' && activeAlert.level === 'National') {
      return activeAlert;
    }
    return null;
  }, [activeAlert]);

  if (isLoading) {
    return <ComponentLoader className="py-20" />;
  }

  if (error) {
    return <div className="text-center py-20 text-red-400">Error: {error}</div>;
  }

  if (activeSurveillanceLayer) {
    return <SurveillanceMapView type={activeSurveillanceLayer} onBack={() => setActiveSurveillanceLayer(null)} />
  }

  if (showBiosecurityModule) {
    return <BiosecurityDashboard country="India" onBack={() => setShowBiosecurityModule(false)} />;
  }

  if (selectedStateId) {
    return <StateDashboard 
              stateId={selectedStateId} 
              onBack={handleBackToNational} 
              activeAlert={activeAlert}
              onEscalate={onEscalate}
              onAcknowledge={onAcknowledge}
              onResolve={onResolve}
            />;
  }

  return (
    <>
      <div className="space-y-6">
        {monitoringAlertToShow && (
          <MonitoringPanel
            currentLevel="National"
            activeAlert={monitoringAlertToShow}
            onResolve={onResolve}
          />
        )}
        {emergencyAlertToShow && (
          <EmergencyResponsePanel
            currentLevel="National"
            activeAlert={emergencyAlertToShow}
            onAcknowledge={onAcknowledge}
            onEscalate={onEscalate}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {oneHealthIndex && <OneHealthIndexPanel indexData={oneHealthIndex} country="India" />}
            <ModuleCard
              title="Bio-Terrorism Threat Module"
              description="Access the biowarfare threat matrix, lab network status, and strategic counter-terrorism analysis."
              icon={<BiohazardIcon className="w-6 h-6 text-red-400" />}
              onClick={() => setShowBiosecurityModule(true)}
            />
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">Syndromic Surveillance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {nationalData.kpiData.map((kpi: Kpi) => (
            kpi.details ? (
              <ExpandableKpiCard key={kpi.title} kpi={kpi} />
            ) : (
              <KpiCard key={kpi.title} {...kpi} />
            )
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <MapChart 
              title="National Case Distribution (Click a state for details)" 
              data={nationalData.mapData} 
              paths={INDIA_STATE_PATHS}
              onStateClick={handleStateSelect}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TrendChart title="Dengue Case Trends" data={nationalData.trendData.dengue} color="#58A6FF" />
                <TrendChart title="Cholera Case Trends" data={nationalData.trendData.cholera} color="#D29922" />
            </div>
          </div>

          <div className="space-y-6">
            <AiAnalysisPanel dataSummary={nationalData.aiSummary} />
            <ThreatSpectrum threats={nationalData.threatSpectrumData} />
            <VaccineOptimizationPanel 
                contextName="India National Vaccine Stockpile"
                inventory={nationalData.oneHealthData.vaccineInventory}
                aiSummary={nationalData.aiSummary}
                population="1.4 Billion"
            />
            <AlertsPanel alerts={nationalData.alerts} />
          </div>

        </div>
        
        <h2 className="text-xl font-bold text-white pt-6 border-t border-brand-light-blue">One Health & Environmental Surveillance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ZoonoticSurveillancePanel 
            alerts={nationalData.oneHealthData.zoonotic}
            slaughterhouseAlerts={nationalData.oneHealthData.slaughterhouses}
            onAlertClick={setZoonoticDetail}
            onSlaughterhouseAlertClick={setSlaughterhouseDetail}
            dataSource="Source: NCDC, Dept. of Animal Husbandry" 
            onViewLayer={() => setActiveSurveillanceLayer('zoonotic')} 
            dataSourceTooltip="Credibility: High. Data aggregated from the National Centre for Disease Control (NCDC) and the Department of Animal Husbandry, Dairying & Fisheries (DAHDF). Includes real-time inputs from state veterinary networks and wildlife health centers."
            slaughterhouseDataSource="Source: FSSAI, Local Municipal Corps."
            slaughterhouseDataSourceTooltip="Credibility: Moderate to High. Data from the Food Safety and Standards Authority of India and local municipal health inspections. Data may have reporting lags."
          />
          <EnvironmentalPanel 
            alerts={nationalData.oneHealthData.environmental} 
            onAlertClick={setWastewaterDetail} 
            dataSource="Source: ICMR Network, CPCB" 
            onViewLayer={() => setActiveSurveillanceLayer('environmental')} 
            dataSourceTooltip="Credibility: High. Data sourced from the Indian Council of Medical Research (ICMR) national wastewater surveillance network and the Central Pollution Control Board (CPCB) for environmental markers. Signals are lab-confirmed."
          />
          <WildlifeSurveillancePanel 
            alerts={nationalData.oneHealthData.wildlife} 
            onAlertClick={setWildlifeDetail} 
            dataSource="Source: Wildlife Institute of India (WII)" 
            onViewLayer={() => setActiveSurveillanceLayer('wildlife')} 
            dataSourceTooltip="Credibility: Moderate to High. Data sourced from the Wildlife Institute of India (WII), Project Tiger, and state forest departments. Data is often event-driven (e.g., mortality events) rather than continuous."
          />
          <DisasterResponsePanel 
            alerts={nationalData.oneHealthData.disasters} 
            onAlertClick={setDisasterDetail} 
            dataSource="Source: NDMA, IMD" 
            onViewLayer={() => setActiveSurveillanceLayer('disaster')} 
            dataSourceTooltip="Credibility: High. Data from the National Disaster Management Authority (NDMA) and the India Meteorological Department (IMD). Disease risk projections are AI-generated based on historical disaster-outbreak correlations."
          />
          <LivestockSurveillancePanel 
            alerts={nationalData.oneHealthData.livestock} 
            onAlertClick={setLivestockDetail} 
            dataSource="Source: Dept. of Animal Husbandry" 
            onViewLayer={() => setActiveSurveillanceLayer('livestock')} 
            dataSourceTooltip="Credibility: High. Data sourced from the Department of Animal Husbandry (DAHDF) and the National Animal Disease Reporting System (NADRS). Includes data from mandatory reporting and active surveillance."
          />
          <LivestockVaccinationPanel 
            stats={nationalLivestockVaccinationStats} 
            dataSource="Source: Dept. of Animal Husbandry (Aggregated)" 
            dataSourceTooltip="Credibility: High. Data aggregated from state-level DAHDF vaccination campaign reports via the NADRS. Represents official government vaccination records."
          />
        </div>
        
        <h2 className="text-xl font-bold text-white pt-6 border-t border-brand-light-blue">Advanced Surveillance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GenomicSurveillancePanel 
                alerts={nationalData.oneHealthData.genomic} 
                onAlertClick={setGenomicDetail} 
                dataSource="Source: INSACOG, NIV Pune" 
                onViewLayer={() => setActiveSurveillanceLayer('genomic')} 
                dataSourceTooltip="Credibility: Very High. Data from the Indian SARS-CoV-2 Genomics Consortium (INSACOG) network and the National Institute of Virology (NIV), Pune. All sequences are lab-verified."
            />
            <ChemicalWeaponPanel
                alerts={nationalData.oneHealthData.chemical}
                onAlertClick={setChemicalDetail}
                dataSource="Source: CPCB & BARC Sensors"
            />
        </div>

      </div>

      {zoonoticDetail && (
        <ZoonoticDetailModal 
          alert={zoonoticDetail} 
          onClose={() => setZoonoticDetail(null)} 
        />
      )}
      {wastewaterDetail && (
        <WastewaterDetailModal 
          alert={wastewaterDetail} 
          onClose={() => setWastewaterDetail(null)} 
        />
      )}
      {wildlifeDetail && (
        <WildlifeDetailModal 
          alert={wildlifeDetail} 
          onClose={() => setWildlifeDetail(null)} 
        />
      )}
      {disasterDetail && (
        <DisasterDetailModal 
          alert={disasterDetail} 
          onClose={() => setDisasterDetail(null)} 
        />
      )}
      {genomicDetail && (
        <GenomicDetailModal
          alert={genomicDetail}
          onClose={() => setGenomicDetail(null)}
        />
      )}
      {livestockDetail && (
        <LivestockDetailModal
          alert={livestockDetail}
          onClose={() => setLivestockDetail(null)}
        />
      )}
      {chemicalDetail && (
        <ChemicalWeaponDetailModal
          alert={chemicalDetail}
          onClose={() => setChemicalDetail(null)}
        />
      )}
      {slaughterhouseDetail && (
        <SlaughterhouseDetailModal
          alert={slaughterhouseDetail}
          onClose={() => setSlaughterhouseDetail(null)}
        />
      )}
    </>
  );
};

export default DashboardIndia;