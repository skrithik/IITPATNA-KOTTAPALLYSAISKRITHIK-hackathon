import React from 'react';
import { Activity, ShieldAlert, Sliders, Cpu, Layers, RefreshCw } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, healthStatus, onTriggerStream }) {
  return (
    <header style={{ borderBottom: '1px solid var(--border-glass)', padding: '16px 32px', background: 'rgba(9, 13, 22, 0.9)', backdropFilter: 'blur(12px)', sticky: 'top', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>
            <Activity color="#ffffff" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#f87171', textTransform: 'uppercase' }}>
              S&P Global & CRISIL Campus Hackathon 2026
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              AI/NLP Risk Engine & Financial Analytics Platform
            </h1>
          </div>
        </div>

        {/* Action Controls & Health Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-primary" onClick={onTriggerStream} style={{ fontSize: '13px', padding: '8px 16px' }}>
            <RefreshCw size={14} /> Simulate Live Stream Feed
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', fontSize: '12px', color: '#34d399', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            Engine Active ({healthStatus?.active_signals_count || 0} Signals)
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', maxWidth: '1400px', margin: '20px auto 0 auto', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px' }}>
        {[
          { id: 'overview', label: 'Live Signal Feed', icon: Activity },
          { id: 'nlp', label: 'NLP Engine Sandbox', icon: Cpu },
          { id: 'rebalancer', label: 'Module A: Index Rebalancer', icon: Sliders },
          { id: 'stresstest', label: 'Module B: Banking Stress Test', icon: ShieldAlert },
          { id: 'architecture', label: 'System Architecture', icon: Layers }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                color: isActive ? '#f87171' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid #ef4444' : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
