import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import NationalBiosecurityIndexPanel from './NationalBiosecurityIndexPanel';
import BiowarfareThreatMatrix from './BiowarfareThreatMatrix';
import NationalLabNetwork from './NationalLabNetwork';
import BiologicalWeaponPanel from './BiologicalWeaponPanel';
import ChemicalWeaponPanel from './ChemicalWeaponPanel';
import BiologicalWeaponDetailModal from './BiologicalWeaponDetailModal';
import ChemicalWeaponDetailModal from './ChemicalWeaponDetailModal';

import { BiologicalWeaponSignal, ChemicalWeaponSignal } from '../types';

interface BiosecurityDashboardProps {
  country: 'US' | 'India';
  onBack: () => void;
}

const BiosecurityDashboard: React.FC<BiosecurityDashboardProps> = ({ country, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [nationalData, setNationalData] = useState<any>(null);
  const [threatSignals, setThreatSignals] = useState<any>(null);

  const [biologicalDetail, setBiologicalDetail] = useState<BiologicalWeaponSignal | null>(null);
  const [chemicalDetail, setChemicalDetail] = useState<ChemicalWeaponSignal | null>(null);

  const API_BASE = "https://aegis-biosurveillance.onrender.com/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch national data
        const nationalRes = await fetch(`${API_BASE}/national/${country}`);
        const nationalJson = await nationalRes.json();

        // Fetch biological + chemical signals
        const threatRes = await fetch(`${API_BASE}/threat-signals`);
        const threatJson = await threatRes.json();

        setNationalData(nationalJson);
        setThreatSignals(threatJson);
      } catch (err) {
        console.error("Failed to load biosecurity dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country]);

  if (loading || !nationalData || !threatSignals) {
    return (
      <div className="text-white text-xl p-4">
        Loading Biosecurity Threat Module…
      </div>
    );
  }

  // Extract signals for selected country
  const biologicalSignals = threatSignals.biologicalSignals[country] || [];
  const chemicalSignals = threatSignals.chemicalSignals[country] || [];

  const biologicalDataSource =
    country === "US" ? "Source: DHS BioWatch Program" : "Source: DRDO & NTRO Network";

  const chemicalDataSource =
    country === "US" ? "Source: EPA Sensor Network" : "Source: CPCB & BARC Sensors";

  return (
    <>
      <div className="space-y-6 animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            Bio-Terrorism Threat Module ({country})
          </h1>

          <button
            onClick={onBack}
            className="bg-brand-light-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-accent transition-colors flex items-center"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Main Dashboard
          </button>
        </div>

        {/* Top Section: National Biosecurity Index */}
        <div className="bg-brand-dark-blue/50 p-6 rounded-lg border border-brand-light-blue">
          <NationalBiosecurityIndexPanel indexData={nationalData.nationalBiosecurityIndexData} />
        </div>

        {/* Mid Section: Threat Matrix & Labs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <BiowarfareThreatMatrix threats={nationalData.biowarfareThreats} />
          </div>
          <div className="lg:col-span-2">
            <NationalLabNetwork labs={nationalData.nationalLabNetworkStatus} />
          </div>
        </div>

        {/* Bottom Section: Real-time Signals */}
        <div>
          <h2 className="text-xl font-bold text-white mt-6 mb-4 border-t border-brand-light-blue pt-6">
            Real-time Environmental Threat Detection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BiologicalWeaponPanel
              alerts={biologicalSignals}
              onAlertClick={setBiologicalDetail}
              dataSource={biologicalDataSource}
            />

            <ChemicalWeaponPanel
              alerts={chemicalSignals}
              onAlertClick={setChemicalDetail}
              dataSource={chemicalDataSource}
            />
          </div>
        </div>

      </div>

      {/* Modals */}
      {biologicalDetail && (
        <BiologicalWeaponDetailModal
          alert={biologicalDetail}
          onClose={() => setBiologicalDetail(null)}
        />
      )}

      {chemicalDetail && (
        <ChemicalWeaponDetailModal
          alert={chemicalDetail}
          onClose={() => setChemicalDetail(null)}
        />
      )}
    </>
  );
};

export default BiosecurityDashboard;
