import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DashboardIndia from './components/DashboardIndia';
import { EscalatedAlert } from './types';

export type DashboardType = 'US' | 'India';

function App() {
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>('US');
  const [activeAlert, setActiveAlert] = useState<EscalatedAlert | null>(null);

  const handleEscalate = (newAlert: EscalatedAlert) => {
    // In a real app, this would be an API call. Here we just update state.
    console.log(`ALERT ESCALATED to ${newAlert.level} from ${newAlert.from}`);
    setActiveAlert(newAlert);
  };

  const handleAcknowledge = (alertToMonitor: EscalatedAlert) => {
    console.log(`Alert acknowledged at ${alertToMonitor.level}, now monitoring.`);
    setActiveAlert({ ...alertToMonitor, status: 'monitoring' });
  };

  const handleResolve = () => {
    console.log('Monitored alert resolved and cleared.');
    setActiveAlert(null);
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_500px_at_50%_200px,#0a3b7855,transparent)]"></div>
      <div className="relative z-10">
        <Header 
          activeDashboard={activeDashboard} 
          setActiveDashboard={setActiveDashboard}
          activeAlert={activeAlert}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          {activeDashboard === 'US' ? (
            <Dashboard /> 
          ) : (
            <DashboardIndia 
              activeAlert={activeAlert}
              onEscalate={handleEscalate}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;