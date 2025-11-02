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
import ZoonoticDetailModal from './ZoonoticDetailModal';
import WastewaterDetailModal from './WastewaterDetailModal';
import WildlifeSurveillancePanel from './WildlifeSurveillancePanel';
import DisasterResponsePanel from './DisasterResponsePanel';
import WildlifeDetailModal from './WildlifeDetailModal';
import DisasterDetailModal from './DisasterDetailModal';
import VaccineOptimizationPanel from './VaccineOptimizationPanel';
import { kpiData, respiratoryTrendData, gastrointestinalTrendData, mapData, mockAlerts, MOCK_DATA_SUMMARY, US_STATE_PATHS, threatSpectrumDataUS, oneHealthIndexDataUS } from './constants';
import { calculateOneHealthIndex } from '../services/oneHealthService';
import { ZoonoticAlert, EnvironmentalAlert, WildlifeAlert, DisasterAlert } from '../types';

const Dashboard: React.FC = () => {
  const [zoonoticDetail, setZoonoticDetail] = useState<ZoonoticAlert | null>(null);
  const [wastewaterDetail, setWastewaterDetail] = useState<EnvironmentalAlert | null>(null);
  const [wildlifeDetail, setWildlifeDetail] = useState<WildlifeAlert | null>(null);
  const [disasterDetail, setDisasterDetail] = useState<DisasterAlert | null>(null);

  const otherKpis = kpiData.filter(kpi => kpi.title !== 'National Alert Level');
  const oneHealthIndex = calculateOneHealthIndex(
    oneHealthIndexDataUS.human,
    oneHealthIndexDataUS.zoonotic,
    oneHealthIndexDataUS.environmental
  );

  return (
    <>
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <OneHealthIndexPanel indexData={oneHealthIndex} country="USA" />
          </div>
          {otherKpis.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left and middle columns */}
          <div className="lg:col-span-2 space-y-6">
            <MapChart title="National Case Distribution" data={mapData} paths={US_STATE_PATHS} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrendChart title="Respiratory Syndrome Trends" data={respiratoryTrendData} color="#58A6FF" />
              <TrendChart title="Gastrointestinal Syndrome Trends" data={gastrointestinalTrendData} color="#238636" />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <AiAnalysisPanel dataSummary={MOCK_DATA_SUMMARY} />
            <ThreatSpectrum threats={threatSpectrumDataUS} />
            <VaccineOptimizationPanel 
                contextName="USA National Stockpile"
                inventory={oneHealthIndexDataUS.vaccineInventory}
                aiSummary={MOCK_DATA_SUMMARY}
                population="331.9 Million"
            />
            <AlertsPanel alerts={mockAlerts} />
          </div>

        </div>

        {/* One Health Modules */}
        <h2 className="text-xl font-bold text-white pt-6 border-t border-brand-light-blue">One Health Surveillance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ZoonoticSurveillancePanel alerts={oneHealthIndexDataUS.zoonotic} onAlertClick={setZoonoticDetail} />
          <EnvironmentalPanel alerts={oneHealthIndexDataUS.environmental} onAlertClick={setWastewaterDetail} />
          <WildlifeSurveillancePanel alerts={oneHealthIndexDataUS.wildlife} onAlertClick={setWildlifeDetail} />
          <DisasterResponsePanel alerts={oneHealthIndexDataUS.disasters} onAlertClick={setDisasterDetail} />
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

export default Dashboard;
