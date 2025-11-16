import React, { useState, useEffect } from 'react';
import { SurveillanceType } from '../../types';
import StateLivestockDetail from './details/StateLivestockDetail';
import StateZoonoticDetail from './details/StateZoonoticDetail';
import StateEnvironmentalDetail from './details/StateEnvironmentalDetail';
import StateGenomicDetail from './details/StateGenomicDetail';
import StateWildlifeDetail from './details/StateWildlifeDetail';
import StateDisasterDetail from './details/StateDisasterDetail';
import { ComponentLoader } from '../shared/common';

interface StateSurveillanceDetailProps {
  type: SurveillanceType;
  stateId: string;
  stateName: string;
}

const StateSurveillanceDetail: React.FC<StateSurveillanceDetailProps> = ({ type, stateId, stateName }) => {
    const [detailData, setDetailData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            setDetailData(null);
            try {
                const response = await fetch(`http://localhost:5000/api/surveillance/detail/${type}/${stateId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`No detailed ${type} surveillance data available for ${stateName}.`);
                    }
                    throw new Error(`Failed to fetch surveillance detail: ${response.statusText}`);
                }
                const data = await response.json();
                setDetailData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [type, stateId, stateName]);

    const renderDetail = () => {
        if (!detailData) return null;

        switch (type) {
            case 'livestock': return <StateLivestockDetail data={detailData} />;
            case 'zoonotic': return <StateZoonoticDetail data={detailData} />;
            case 'environmental': return <StateEnvironmentalDetail data={detailData} />;
            case 'genomic': return <StateGenomicDetail data={detailData} />;
            case 'wildlife': return <StateWildlifeDetail data={detailData} />;
            case 'disaster': return <StateDisasterDetail data={detailData} />;
            default: return null;
        }
    };
    
    return (
        <div className="animate-fadeIn h-full flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-1">
                {stateName}
            </h2>
             <p className="text-sm text-gray-400 mb-4 capitalize">{type} Surveillance Details</p>
             <div className="overflow-y-auto flex-grow pr-2">
                {isLoading ? <ComponentLoader /> : error ? <p className="text-yellow-400 text-center py-10">{error}</p> : renderDetail()}
             </div>
        </div>
    );
};

export default StateSurveillanceDetail;