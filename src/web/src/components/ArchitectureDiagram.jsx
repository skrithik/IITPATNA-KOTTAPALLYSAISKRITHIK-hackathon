import React from 'react';
import { Layers, Database, Cpu, ArrowRight, Sliders, ShieldAlert, Globe, Server } from 'lucide-react';

export default function ArchitectureDiagram() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div className="glass-card">
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers color="#ef4444" size={24} />
          End-to-End System Architecture & Data Flow
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
          Overview of the unified pipeline from unstructured data ingestion to downstream risk execution.
        </p>
      </div>

      {/* Interactive Diagram Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        
        {/* Step 1: Ingestion */}
        <div className="glass-card" style={{ borderTop: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa', letterSpacing: '1px' }}>LAYER 1</div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '4px 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="#3b82f6" /> Data Ingestion
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              📰 Financial News Feeds (Reuters, WSJ, NewsAPI)
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              🐦 Social Media (Twitter/X, StockTwits)
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              ⚡ Real-Time Stream Simulator
            </div>
          </div>
        </div>

        {/* Step 2: NLP Engine */}
        <div className="glass-card" style={{ borderTop: '4px solid #ef4444' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', letterSpacing: '1px' }}>LAYER 2 (CORE)</div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '4px 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="#ef4444" /> AI/NLP Risk Engine
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              🎯 Entity & Ticker NER Extractor
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              📊 VADER + FinLexicon Sentiment (-1.0 to +1.0)
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              🏷️ Event Classifier (8 Categories)
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              ⚠️ Severity Impact Score Predictor (1-10)
            </div>
          </div>
        </div>

        {/* Step 3: Signal Bus & API */}
        <div className="glass-card" style={{ borderTop: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', letterSpacing: '1px' }}>LAYER 3</div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '4px 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="#8b5cf6" /> Signal Bus & REST API
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              🌐 FastAPI Server (REST Endpoints)
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              🔄 JSON Schema Validation & Persistence
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              📡 Event-Driven Event Emitter
            </div>
          </div>
        </div>

        {/* Step 4: Downstream Applications */}
        <div className="glass-card" style={{ borderTop: '4px solid #10b981' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', letterSpacing: '1px' }}>LAYER 4</div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '4px 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#10b981" /> Downstream Modules
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', padding: '8px 12px', borderRadius: '6px', color: '#34d399' }}>
              <strong>Module A:</strong> High-Frequency Index Rebalancer ($100M Index)
            </div>
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 12px', borderRadius: '6px', color: '#f87171' }}>
              <strong>Module B:</strong> Wholesale Banking Stress Tester ($1.25B Portfolio)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
