import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { SurveillanceType, StateData } from '../../types';
import MapChart from '../MapChart';
import { INDIA_STATE_PATHS } from '../../data/constants';
import StateSurveillanceDetail from './StateSurveillanceDetail';
import { ComponentLoader } from '../shared/common';

interface SurveillanceMapViewProps {
  type: SurveillanceType;
  onBack: () => void;
}

const surveillanceTitles: Record<SurveillanceType, string> = {
    livestock: "National Livestock Surveillance Grid",
    zoonotic: "National Zoonotic Surveillance Grid",
    environmental: "National Environmental Surveillance Grid",
    wildlife: "National Wildlife Surveillance Grid",
    disaster: "National Disaster Preparedness Grid",
    genomic: "National Genomic Surveillance Grid",
};


const SurveillanceMapView: React.FC<SurveillanceMapViewProps> = ({ type, onBack }) => {
  const [selectedState, setSelectedState] = useState<{ id: string, name: string } | null>(null);
  const [mapData, setMapData] = useState<StateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = surveillanceTitles[type];
  
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/surveillance/map/${type}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch map data: ${response.statusText}`);
            }
            const data = await response.json();
            setMapData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [type]);

  const handleStateSelect = (stateId: string, stateName: string) => {
    setSelectedState({ id: stateId, name: stateName });
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
       {/* Header */}
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
                {title}
            </h1>
            <button
                onClick={onBack}
                className="bg-brand-light-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-accent transition-colors flex items-center"
            >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Main Dashboard
            </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? <ComponentLoader /> : error ? <div className="text-red-400">{error}</div> : (
                <MapChart
                    title="State-wise Risk Index (Click for Details)"
                    data={mapData}
                    paths={INDIA_STATE_PATHS}
                    onStateClick={handleStateSelect}
                />
            )}
            
            <div className="bg-brand-dark-blue border border-brand-light-blue rounded-lg p-6 shadow-lg">
                {selectedState ? (
                    <StateSurveillanceDetail type={type} stateId={selectedState.id} stateName={selectedState.name} />
                ) : (
                    <div className="h-full flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-brand-light-blue/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white">Select a State</h3>
                        <p className="text-gray-400 mt-1">Click on a state in the map to view detailed, grassroots-level surveillance data.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default SurveillanceMapView;