import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DashboardIndia from './components/DashboardIndia';

export type DashboardType = 'US' | 'India';

function App() {
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>('US');

  return (
    <div className="min-h-screen bg-brand-dark font-sans">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_500px_at_50%_200px,#0a3b7855,transparent)]"></div>
      <div className="relative z-10">
        <Header activeDashboard={activeDashboard} setActiveDashboard={setActiveDashboard} />
        <main className="p-4 sm:p-6 lg:p-8">
          {activeDashboard === 'US' ? <Dashboard /> : <DashboardIndia />}
        </main>
      </div>
    </div>
  );
}

export default App;