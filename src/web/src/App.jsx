import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import NlpControlTab from './components/NlpControlTab';
import RebalancerTab from './components/RebalancerTab';
import StressTestTab from './components/StressTestTab';
import ArchitectureDiagram from './components/ArchitectureDiagram';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [signals, setSignals] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [selectedSignalForStress, setSelectedSignalForStress] = useState(null);

  const fetchSignals = async () => {
    try {
      const res = await fetch('/api/signals');
      const data = await res.json();
      setSignals(data);
    } catch (err) {
      console.error('Error fetching signals:', err);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/system/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch (err) {
      console.error('Error fetching health status:', err);
    }
  };

  const handleTriggerStream = async () => {
    try {
      const res = await fetch('/api/stream/simulated');
      const newSignal = await res.json();
      setSignals(prev => [...prev, newSignal]);
      fetchHealth();
    } catch (err) {
      console.error('Error triggering simulated stream:', err);
    }
  };

  const handleAnalyzeText = async (rawItem) => {
    const res = await fetch('/api/ingest/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rawItem)
    });
    const newSignal = await res.json();
    setSignals(prev => [...prev, newSignal]);
    fetchHealth();
    return newSignal;
  };

  const handleSelectSignalForStress = (sig) => {
    setSelectedSignalForStress(sig);
    setActiveTab('stresstest');
  };

  useEffect(() => {
    fetchSignals();
    fetchHealth();

    // Poll health status & signals every 10 seconds
    const interval = setInterval(() => {
      fetchSignals();
      fetchHealth();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        healthStatus={healthStatus}
        onTriggerStream={handleTriggerStream}
      />

      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px 32px' }}>
        {activeTab === 'overview' && (
          <OverviewTab 
            signals={signals} 
            onSelectSignalForStress={handleSelectSignalForStress} 
          />
        )}

        {activeTab === 'nlp' && (
          <NlpControlTab 
            onAnalyzeText={handleAnalyzeText} 
          />
        )}

        {activeTab === 'rebalancer' && (
          <RebalancerTab 
            signals={signals} 
          />
        )}

        {activeTab === 'stresstest' && (
          <StressTestTab 
            selectedSignalForStress={selectedSignalForStress} 
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureDiagram />
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '20px 32px', textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)', background: 'rgba(9, 13, 22, 0.95)' }}>
        S&P Global & CRISIL Campus Hackathon 2026 • Unified AI/NLP Financial Risk Engine • Built by Kottapally Sai Skrithik (IIT Patna)
      </footer>
    </div>
  );
}
