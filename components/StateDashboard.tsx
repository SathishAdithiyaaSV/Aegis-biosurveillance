import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { detailedStateData } from '../data/stateData';
import StateProfilePanel from './StateProfilePanel';
import DataSourcesCredit from './DataSourcesCredit';
import StateActionPlanPanel from './StateActionPlanPanel';
import ViralGenomicsPanel from './ViralGenomicsPanel';
import MapChart from './MapChart';
import DistrictDashboard from './DistrictDashboard';
import DrugInventoryPanel from './DrugInventoryPanel';
import VaccineOptimizationPanel from './VaccineOptimizationPanel';
import StateZoonoticPanel from './StateZoonoticPanel';
import StateEnvironmentalPanel from './StateEnvironmentalPanel';

interface StateDashboardProps {
  stateId: string;
  onBack: () => void;
}

const StateDashboard: React.FC<StateDashboardProps> = ({ stateId, onBack }) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const data = detailedStateData[stateId];

  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrictId(districtId);
  };

  const handleBackToStateView = () => {
    setSelectedDistrictId(null);
  };

  if (!data) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-400">Error</h2>
        <p className="text-gray-400 mt-2">No detailed data available for state ID: {stateId}</p>
        <button
          onClick={onBack}
          className="mt-6 bg-brand-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors flex items-center mx-auto"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to National View
        </button>
      </div>
    );
  }

  if (selectedDistrictId) {
    const districtData = data.districts.find(d => d.id === selectedDistrictId);
    if (districtData) {
      return <DistrictDashboard district={districtData} stateName={data.name} onBack={handleBackToStateView} />;
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">
          {data.name} Biosurveillance Dashboard
        </h1>
        <button
          onClick={onBack}
          className="bg-brand-light-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-accent transition-colors flex items-center"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to National View
        </button>
      </div>
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.kpis.map(kpi => (
              <div key={kpi.title} className="bg-brand-dark-blue border border-brand-light-blue rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-400 truncate">{kpi.title}</p>
                  <div className="flex justify-between items-baseline">
                      <p className="mt-1 text-3xl font-semibold text-white">{kpi.value}</p>
                      <p className={`text-sm font-semibold ${kpi.changeType === 'increase' ? 'text-red-400' : 'text-green-400'}`}>
                          {kpi.change}
                      </p>
                  </div>
              </div>
          ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <StateProfilePanel profile={data.profile} dominantStrain={data.viralGenomics.dominantStrain} />
          <ViralGenomicsPanel genomicsData={data.viralGenomics} />
          <DataSourcesCredit sources={data.profile.dataSources} />
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-1 space-y-6">
             {data.districtPaths && data.districtPaths.length > 0 ? (
              <MapChart 
                title={`${data.name} District Hotspots`} 
                data={data.districts.map(d => ({id: d.id, name: d.name, value: d.value}))} 
                paths={data.districtPaths}
                onStateClick={handleDistrictSelect}
              />
            ) : (
                <div className="bg-brand-dark-blue border border-brand-light-blue rounded-lg p-4 shadow-lg h-full flex items-center justify-center">
                    <p className="text-gray-500">No district-level data available.</p>
                </div>
            )}
            <VaccineOptimizationPanel
                contextName={`${data.name} State`}
                inventory={data.vaccineInventory || []}
                aiSummary={data.aiSummary}
                population={data.profile.population}
            />
            <DrugInventoryPanel contextName={data.name} inventory={data.drugInventory} aiSummary={data.aiSummary} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
            {data.zoonoticAlerts && <StateZoonoticPanel alerts={data.zoonoticAlerts} />}
            {data.environmentalAlerts && <StateEnvironmentalPanel alerts={data.environmentalAlerts} />}
            <StateActionPlanPanel stateName={data.name} summary={data.aiSummary} />
        </div>

      </div>
    </div>
  );
};

export default StateDashboard;
