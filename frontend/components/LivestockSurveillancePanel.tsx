
import React, { useState, useMemo } from 'react';
import { CircleStackIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { LivestockAlert } from '../types';
import { InfoTooltip } from './shared/common';

const LivestockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.75 0h.008v.015H9v-.015zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.75 0h.008v.015h-.008v-.015z" />
    </svg>
);

interface LivestockSurveillancePanelProps {
  alerts: LivestockAlert[];
  onAlertClick: (alert: LivestockAlert) => void;
  dataSource: string;
  dataSourceTooltip?: string;
  onViewLayer?: () => void;
}

const LivestockSurveillancePanel: React.FC<LivestockSurveillancePanelProps> = ({ alerts, onAlertClick, dataSource, dataSourceTooltip, onViewLayer }) => {
  const [filter, setFilter] = useState('');

  const getRiskColor = (risk: 'High' | 'Moderate' | 'Low') => {
    switch (risk) {
      case 'High': return 'text-orange-400';
      case 'Moderate': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  }
  
  const getRiskBorder = (risk: 'High' | 'Moderate' | 'Low') => {
    switch (risk) {
      case 'High': return 'border-orange-500';
      case 'Moderate': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  }

  const filteredAlerts = useMemo(() => {
    if (!filter.trim()) {
        return alerts;
    }
    return alerts.filter(alert =>
        alert.disease.toLowerCase().includes(filter.toLowerCase()) ||
        alert.species.toLowerCase().includes(filter.toLowerCase())
    );
  }, [alerts, filter]);

  return (
    <div className="bg-brand-dark-blue border border-brand-light-blue rounded-lg p-4 shadow-lg flex flex-col">
      <div className="mb-4">
        <h3 className="text-md font-semibold text-white flex items-center">
          <LivestockIcon className="w-5 h-5 mr-2 text-lime-400" />
          Livestock Disease Surveillance
        </h3>
      </div>
      
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by disease or species..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-brand-dark border border-brand-light-blue rounded-md py-1.5 pl-8 pr-3 text-sm placeholder-gray-500 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent"
          aria-label="Filter livestock alerts by disease or species"
        />
      </div>

      <div className="flex-grow overflow-y-auto max-h-60 pr-1">
        {filteredAlerts.length > 0 ? (
          <div className="space-y-3 text-sm text-gray-400">
            {filteredAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 bg-brand-dark rounded-md border-l-4 ${getRiskBorder(alert.riskLevel)} transition-all duration-200 hover:border-brand-accent hover:shadow-md cursor-pointer`}
                onClick={() => onAlertClick(alert)}
                aria-label={`View details for ${alert.disease} alert`}
                role="button"
              >
                <p className="font-semibold text-white">{alert.disease} <span className="text-gray-400 font-normal">in {alert.species}</span></p>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className={`${getRiskColor(alert.riskLevel)} font-bold`}>Risk: {alert.riskLevel}</span>
                  <span>Impact: {alert.economicImpact}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-xs py-2">
              No livestock alerts match criteria.
            </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-brand-light-blue/30">
        {onViewLayer && (
            <button
                onClick={onViewLayer}
                className="w-full bg-brand-light-blue/50 text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-accent transition-colors text-sm mb-3"
            >
                View National Grid &rarr;
            </button>
        )}
        <div className="flex items-center text-xs text-gray-500">
            <CircleStackIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{dataSource}</span>
            {dataSourceTooltip && <div className="ml-1.5"><InfoTooltip text={dataSourceTooltip} /></div>}
        </div>
      </div>
    </div>
  );
};

export default LivestockSurveillancePanel;
