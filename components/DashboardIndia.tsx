import React, { useState } from 'react';
import KpiCard from './KpiCard';
import TrendChart from './TrendChart';
import MapChart from './MapChart';
import AlertsPanel from './AlertsPanel';
import AiAnalysisPanel from './AiAnalysisPanel';
import ThreatSpectrum from './ThreatSpectrum';
import ZoonoticSurveillancePanel from './ZoonoticSurveillancePanel';
import EnvironmentalPanel from './EnvironmentalPanel';
import OneHealthIndexPanel from './OneHealthIndexPanel';
import StateDashboard from './StateDashboard';
import ZoonoticDetailModal from './ZoonoticDetailModal';
import WastewaterDetailModal from './WastewaterDetailModal';
import ExpandableKpiCard from './ExpandableKpiCard';
import WildlifeSurveillancePanel from './WildlifeSurveillancePanel';
import DisasterResponsePanel from './DisasterResponsePanel';
import WildlifeDetailModal from './WildlifeDetailModal';
import DisasterDetailModal from './DisasterDetailModal';
import VaccineOptimizationPanel from './VaccineOptimizationPanel';
import { kpiDataIndia, dengueTrendData, choleraTrendData, mapDataIndia, mockAlertsIndia, MOCK_DATA_SUMMARY_INDIA, INDIA_STATE_PATHS, threatSpectrumDataIndia, oneHealthIndexDataIndia } from './constants';
import { calculateOneHealthIndex } from '../services/oneHealthService';
import { ZoonoticAlert, EnvironmentalAlert, WildlifeAlert, DisasterAlert } from '../types';

const DashboardIndia: React.FC = () => {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [zoonoticDetail, setZoonoticDetail] = useState<ZoonoticAlert | null>(null);
  const [wastewaterDetail, setWastewaterDetail] = useState<EnvironmentalAlert | null>(null);
  const [wildlifeDetail, setWildlifeDetail] = useState<WildlifeAlert | null>(null);
  const [disasterDetail, setDisasterDetail] = useState<DisasterAlert | null>(null);

  const otherKpis = kpiDataIndia.filter(kpi => kpi.title !== 'National Alert Level');
  const oneHealthIndex = calculateOneHealthIndex(
    oneHealthIndexDataIndia.human,
    oneHealthIndexDataIndia.zoonotic,
    oneHealthIndexDataIndia.environmental
  );

  const handleStateSelect = (stateId: string) => {
    setSelectedStateId(stateId);
  };

  const handleBackToNational = () => {
    setSelectedStateId(null);
  };

  if (selectedStateId) {
    return <StateDashboard stateId={selectedStateId} onBack={handleBackToNational} />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <OneHealthIndexPanel indexData={oneHealthIndex} country="India" />
          </div>
          {otherKpis.map((kpi) => (
            kpi.details ? (
              <ExpandableKpiCard key={kpi.title} kpi={kpi} />
            ) : (
              <KpiCard key={kpi.title} {...kpi} />
            )
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left and middle columns */}
          <div className="lg:col-span-2 space-y-6">
            <MapChart 
              title="National Case Distribution (Click a state for details)" 
              data={mapDataIndia} 
              paths={INDIA_STATE_PATHS}
              onStateClick={handleStateSelect}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrendChart title="Dengue Fever Trends" data={dengueTrendData} color="#D29922" />
              <TrendChart title="Cholera Outbreak Trends" data={choleraTrendData} color="#F85149" />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <AiAnalysisPanel dataSummary={MOCK_DATA_SUMMARY_INDIA} />
            <ThreatSpectrum threats={threatSpectrumDataIndia} />
            <VaccineOptimizationPanel 
                contextName="India National Vaccine Stockpile"
                inventory={oneHealthIndexDataIndia.vaccineInventory}
                aiSummary={MOCK_DATA_SUMMARY_INDIA}
                population="1.4 Billion"
            />
            <AlertsPanel alerts={mockAlertsIndia} />
          </div>

        </div>
        
        {/* One Health Modules */}
        <h2 className="text-xl font-bold text-white pt-6 border-t border-brand-light-blue">One Health Surveillance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ZoonoticSurveillancePanel alerts={oneHealthIndexDataIndia.zoonotic} onAlertClick={setZoonoticDetail} />
          <EnvironmentalPanel alerts={oneHealthIndexDataIndia.environmental} onAlertClick={setWastewaterDetail} />
          <WildlifeSurveillancePanel alerts={oneHealthIndexDataIndia.wildlife} onAlertClick={setWildlifeDetail} />
          <DisasterResponsePanel alerts={oneHealthIndexDataIndia.disasters} onAlertClick={setDisasterDetail} />
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
    </>
  );
};

export default DashboardIndia;
