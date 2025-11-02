import React from 'react';
import { BugAntIcon } from '@heroicons/react/24/solid';
import { ZoonoticAlert, RiskLevel } from '../types';

interface ZoonoticSurveillancePanelProps {
  alerts: ZoonoticAlert[];
  onAlertClick: (alert: ZoonoticAlert) => void;
}

const ZoonoticSurveillancePanel: React.FC<ZoonoticSurveillancePanelProps> = ({ alerts, onAlertClick }) => {

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'Critical': return 'text-red-400';
      case 'High': return 'text-orange-400';
      case 'Moderate': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  }

  return (
    <div className="bg-brand-dark-blue border border-brand-light-blue rounded-lg p-4 shadow-lg">
      <h3 className="text-md font-semibold text-white mb-4 flex items-center">
        <BugAntIcon className="w-5 h-5 mr-2 text-yellow-400" />
        Zoonotic Surveillance
      </h3>
      {alerts.length > 0 ? (
        <div className="space-y-3 text-sm text-gray-400">
          {alerts.map((alert, index) => (
            <div 
              key={index} 
              className="p-3 bg-brand-dark rounded-md border border-brand-light-blue transition-all duration-200 hover:border-brand-accent hover:shadow-md cursor-pointer"
              onClick={() => onAlertClick(alert)}
              aria-label={`View details for ${alert.name} alert`}
              role="button"
            >
              <p className="font-semibold text-white">{alert.name}</p>
              <div className="flex justify-between items-center text-xs mt-1">
                <span>Alert in: {alert.location}</span>
                <span className={`${getRiskColor(alert.risk)} font-bold`}>Risk: {alert.risk}</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-center pt-2 text-gray-500">Click an alert for a detailed analysis.</p>
        </div>
      ) : (
         <div className="text-center text-gray-500 text-sm py-8">
            No active zoonotic alerts.
          </div>
      )}
    </div>
  );
};

export default ZoonoticSurveillancePanel;
