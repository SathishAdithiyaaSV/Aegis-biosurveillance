import React from 'react';
import { BeakerIcon } from '@heroicons/react/24/solid';
import { EnvironmentalAlert } from '../types';

interface EnvironmentalPanelProps {
  alerts: EnvironmentalAlert[];
  onAlertClick: (alert: EnvironmentalAlert) => void;
}

const EnvironmentalPanel: React.FC<EnvironmentalPanelProps> = ({ alerts, onAlertClick }) => {
  
  const getStatusColor = (status: 'Confirmed' | 'Trending') => {
    return status === 'Confirmed' ? 'text-red-400' : 'text-orange-400';
  }

  return (
    <div className="bg-brand-dark-blue border border-brand-light-blue rounded-lg p-4 shadow-lg">
      <h3 className="text-md font-semibold text-white mb-4 flex items-center">
        <BeakerIcon className="w-5 h-5 mr-2 text-green-400" />
        Wastewater & Environmental Risk
      </h3>
       {alerts.length > 0 ? (
          <div className="space-y-3 text-sm text-gray-400">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className="p-3 bg-brand-dark rounded-md border border-brand-light-blue transition-all duration-200 hover:border-brand-accent hover:shadow-md cursor-pointer"
                onClick={() => onAlertClick(alert)}
                aria-label={`View details for ${alert.name} signal`}
                role="button"
              >
                <p className="font-semibold text-white">{alert.name}</p>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span>Location: {alert.location}</span>
                  <span className={`${getStatusColor(alert.status)} font-bold`}>
                    {alert.status === 'Trending' && alert.signalStrength ? `Signal Strength: +${alert.signalStrength}%` : `Status: ${alert.status}`}
                  </span>
                </div>
              </div>
            ))}
            <p className="text-xs text-center pt-2 text-gray-500">Click a signal for detailed analysis.</p>
          </div>
        ) : (
           <div className="text-center text-gray-500 text-sm py-8">
            No environmental signals detected.
          </div>
        )}
    </div>
  );
};

export default EnvironmentalPanel;
