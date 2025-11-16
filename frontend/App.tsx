import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DashboardIndia from './components/DashboardIndia';
import { EscalatedAlert } from './types';

// Backend API service functions
const API_BASE = "https://aegis-biosurveillance.onrender.com/api/escalation";

async function getActiveEscalation() {
  const res = await fetch(`${API_BASE}/active`);
  return res.json();
}

async function escalateAlert(newAlert: EscalatedAlert) {
  const res = await fetch(`${API_BASE}/escalate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAlert),
  });
  return res.json();
}

async function acknowledgeAlert(id: string) {
  const res = await fetch(`${API_BASE}/acknowledge/${id}`, {
    method: "PUT",
  });
  return res.json();
}

async function resolveAlert(id: string) {
  const res = await fetch(`${API_BASE}/resolve/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export type DashboardType = 'US' | 'India';

function App() {
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>('US');
  const [activeAlert, setActiveAlert] = useState<EscalatedAlert | null>(null);

  // -----------------------------------------
  // Load active escalation from backend
  // -----------------------------------------
  useEffect(() => {
    async function loadEscalation() {
      try {
        const escalation = await getActiveEscalation();
        setActiveAlert(escalation);
      } catch (err) {
        console.error("Failed to load escalation:", err);
      }
    }

    loadEscalation();

    // Poll every 8 seconds for live sync
    const interval = setInterval(loadEscalation, 8000);
    return () => clearInterval(interval);
  }, []);

  // -----------------------------------------
  // Escalation: CREATE
  // -----------------------------------------
  const handleEscalate = async (newAlert: EscalatedAlert) => {
  try {
    const res = await fetch("https://aegis-biosurveillance.onrender.com/api/escalation/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAlert),
    });

    if (!res.ok) throw new Error("Escalation failed");

    console.log("Alert escalated & emergency communication triggered!");

    setActiveAlert(newAlert);
  } catch (err) {
    console.error(err);
  }
};


  // -----------------------------------------
  // Escalation: ACKNOWLEDGE → monitoring
  // -----------------------------------------
  const handleAcknowledge = async (alertToMonitor: EscalatedAlert) => {
    try {
      const updated = await acknowledgeAlert(alertToMonitor._id!);
      setActiveAlert(updated);
      console.log("Acknowledged:", updated);
    } catch (err) {
      console.error("Acknowledge failed:", err);
    }
  };

  // -----------------------------------------
  // Escalation: RESOLVE
  // -----------------------------------------
  const handleResolve = async () => {
    try {
      if (!activeAlert?._id) return;
      await resolveAlert(activeAlert._id);
      setActiveAlert(null);
      console.log("Escalation resolved.");
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_500px_at_50%_200px,#0a3b7855,transparent)]"></div>
      <div className="relative z-10">
        
        {/* TOP HEADER */}
        <Header 
          activeDashboard={activeDashboard} 
          setActiveDashboard={setActiveDashboard}
          activeAlert={activeAlert}
        />

        {/* MAIN CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeDashboard === 'US' ? (
            <Dashboard 
              activeAlert={activeAlert}
              onEscalate={handleEscalate}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
            />
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
