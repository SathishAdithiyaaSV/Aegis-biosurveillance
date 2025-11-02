import React from 'react';
import { MagnifyingGlassIcon, BugAntIcon, FireIcon, BeakerIcon, BuildingStorefrontIcon, UserGroupIcon, EyeDropperIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { DistrictSurveillanceData, LocalEnvironmentalSignal } from '../types';

const SurveillanceMetric: React.FC<{
    icon: React.ReactNode;
    value: string;
    label: string;
    colorClass: string;
}> = ({ icon, value, label, colorClass }) => (
    <div className="bg-brand-dark p-3 rounded-lg flex items-center">
        <div className={`mr-3 p-2 rounded-full bg-brand-light-blue/50 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className={`text-lg font-bold ${colorClass}`}>{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    </div>
);

const getSignalIcon = (sourceType: LocalEnvironmentalSignal['sourceType']) => {
    switch(sourceType) {
        case 'Water Source': return <BeakerIcon className="w-4 h-4 mr-3 mt-0.5 text-blue-400 flex-shrink-0" />;
        case 'Market': return <BuildingStorefrontIcon className="w-4 h-4 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" />;
        case 'Community Report': return <UserGroupIcon className="w-4 h-4 mr-3 mt-0.5 text-green-400 flex-shrink-0" />;
        case 'Zoonotic Wastewater': return <EyeDropperIcon className="w-4 h-4 mr-3 mt-0.5 text-purple-400 flex-shrink-0" />;
        case 'Water Management': return <ExclamationCircleIcon className="w-4 h-4 mr-3 mt-0.5 text-orange-400 flex-shrink-0" />;
        default: return <BeakerIcon className="w-4 h-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />;
    }
}

const DistrictSurveillancePanel: React.FC<{ surveillanceData: DistrictSurveillanceData }> = ({ surveillanceData }) => {
    
    const getVectorDensityColor = (density: 'High' | 'Moderate' | 'Low') => {
        switch (density) {
            case 'High': return 'text-red-400';
            case 'Moderate': return 'text-yellow-400';
            case 'Low': return 'text-green-400';
        }
    };
    
    return (
        <div className="bg-brand-dark-blue border border-brand-light-blue rounded-lg p-6 shadow-lg">
            <h3 className="text-md font-semibold text-white mb-4 flex items-center">
                <MagnifyingGlassIcon className="w-5 h-5 mr-2 text-gray-400" />
                Local Surveillance Intelligence
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SurveillanceMetric 
                    icon={<BugAntIcon className="w-5 h-5" />}
                    value={surveillanceData.vectorDensityIndex}
                    label="Vector Density"
                    colorClass={getVectorDensityColor(surveillanceData.vectorDensityIndex)}
                />
                 <SurveillanceMetric 
                    icon={<FireIcon className="w-5 h-5" />}
                    value={surveillanceData.feverSurveyReports.toLocaleString()}
                    label="Syndromic Fever Reports"
                    colorClass="text-brand-accent"
                />
            </div>
            
            {surveillanceData.localEnvironmentalSignals.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-white mt-4 mb-2">Grassroots Environmental Signals</h4>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {surveillanceData.localEnvironmentalSignals.map(signal => (
                            <li key={signal.id} className={`bg-brand-dark p-3 rounded-md transition-all duration-300 ${signal.highlight ? 'border border-brand-accent shadow-glow' : 'border border-transparent'}`}>
                                <div className="flex items-start">
                                    {getSignalIcon(signal.sourceType)}
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-300">{signal.description}</p>
                                        <p className="text-xs text-gray-500">{signal.sourceType}</p>
                                    </div>
                                </div>
                                {signal.imageUrl && (
                                    <div className="mt-2 pl-7">
                                        <img src={signal.imageUrl} alt={signal.description} className="rounded-md h-24 w-full object-cover border border-brand-light-blue" />
                                        <p className="text-center text-xs text-gray-500 mt-1">Sample Image</p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DistrictSurveillancePanel;
