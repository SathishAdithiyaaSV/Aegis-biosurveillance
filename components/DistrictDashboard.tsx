import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { DistrictData } from '../types';
import AlertsPanel from './AlertsPanel';
import DistrictHospitalPanel from './DistrictHospitalPanel';
import DistrictSurveillancePanel from './DistrictSurveillancePanel';
import DistrictProfilePanel from './DistrictProfilePanel';
import DrugInventoryPanel from './DrugInventoryPanel';
import DistrictActionPlanPanel from './DistrictActionPlanPanel';

interface DistrictDashboardProps {
  district: DistrictData;
  stateName: string;
  onBack: () => void;
}

const DistrictDashboard: React.FC<DistrictDashboardProps> = ({ district, stateName, onBack }) => {
  // Adapt district alerts to the format expected by AlertsPanel
  const formattedAlerts = district.alerts.map(alert => ({
    ...alert,
    location: `${district.name}, ${stateName.slice(0, 2).toUpperCase()}`, // e.g., Ernakulam, KL
    district: district.name,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white">
            {district.name} District Command Center
            </h1>
            <p className="text-lg text-gray-400">{stateName}</p>
        </div>
        <button
          onClick={onBack}
          className="bg-brand-light-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-accent transition-colors flex items-center"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to State View
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Context & Local Intel */}
        <div className="lg:col-span-1 space-y-6">
            <DistrictProfilePanel profile={district.profile} />
            <DistrictSurveillancePanel surveillanceData={district.surveillanceData} />
        </div>

        {/* Middle Column: Healthcare Response */}
        <div className="lg:col-span-1 space-y-6">
            <DistrictHospitalPanel hospitalData={district.hospitalData} />
            <DrugInventoryPanel 
                contextName={`${district.name} District`}
                inventory={district.drugInventory}
                aiSummary={district.aiSummary}
            />
        </div>

        {/* Right Column: Alerts & AI Actions */}
        <div className="lg:col-span-1 space-y-6">
            <AlertsPanel alerts={formattedAlerts} />
            <DistrictActionPlanPanel 
                districtName={district.name}
                stateName={stateName}
                summary={district.aiSummary}
            />
        </div>
      </div>
    </div>
  );
};

export default DistrictDashboard;
