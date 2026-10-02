import React, { useState } from 'react';
import { Search, TrendingUp, AlertTriangle, FileText, CheckCircle2, Zap } from 'lucide-react';

export default function OverviewTab({ signals, onSelectSignalForStress }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredSignals = signals.filter(sig => {
    const matchesSearch = 
      sig.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sig.target_ticker && sig.target_ticker.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sig.target_company && sig.target_company.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = categoryFilter === 'ALL' || sig.event_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalSignals = signals.length;
  const highImpactCount = signals.filter(s => s.impact_score >= 7.0).length;
  const avgSentiment = (signals.reduce((acc, s) => acc + s.sentiment_score, 0) / (totalSignals || 1)).toFixed(2);
  const positiveCount = signals.filter(s => s.sentiment_label === 'Positive').length;
  const negativeCount = signals.filter(s => s.sentiment_label === 'Negative').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL RISK SIGNALS</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>{totalSignals}</div>
          <div style={{ fontSize: '12px', color: '#60a5fa', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} /> Multi-Source Live Feed
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>HIGH IMPACT SEVERITY (&gt;=7.0)</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#f87171', marginTop: '4px' }}>{highImpactCount}</div>
          <div style={{ fontSize: '12px', color: '#fca5a5', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={14} /> Triggers Module B Stress Test
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>NET SENTIMENT AGGREGATE</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: avgSentiment >= 0 ? '#34d399' : '#f87171', marginTop: '4px' }}>
            {avgSentiment >= 0 ? `+${avgSentiment}` : avgSentiment}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {positiveCount} Positive / {negativeCount} Negative
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>MANAGED ASSETS (MODULE A & B)</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>$1.35 Billion</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
            $100M S&P Index + $1.25B Wholesale Bank
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <Search color="var(--text-muted)" size={18} />
          <input
            type="text"
            className="glass-input"
            placeholder="Search signals by ticker, company, or keyword (e.g., NVDA, rate hike)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'Geopolitical', 'Macroeconomic', 'Credit Event', 'Regulatory', 'Product Launch', 'Supply Chain', 'Earnings/Financials'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)',
                background: categoryFilter === cat ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)',
                color: categoryFilter === cat ? '#f87171' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Signals Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="#ef4444" />
          Ingested Real-Time Risk Intelligence Feed ({filteredSignals.length})
        </h3>

        {filteredSignals.map(sig => {
          const isHighImpact = sig.impact_score >= 7.0;
          return (
            <div
              key={sig.signal_id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '18px 24px',
                borderColor: isHighImpact ? 'rgba(239, 68, 68, 0.35)' : 'var(--border-glass)',
                background: isHighImpact ? 'rgba(239, 68, 68, 0.04)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)' }}>{sig.signal_id}</span>
                  <span className="badge badge-category">{sig.event_category}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sig.source_type} ({sig.source_name})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={sig.sentiment_score >= 0.15 ? 'badge badge-positive' : sig.sentiment_score <= -0.15 ? 'badge badge-negative' : 'badge badge-neutral'}>
                    Sentiment: {sig.sentiment_score >= 0 ? `+${sig.sentiment_score}` : sig.sentiment_score} ({sig.sentiment_label})
                  </span>

                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: isHighImpact ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                    color: isHighImpact ? '#f87171' : '#60a5fa',
                    border: `1px solid ${isHighImpact ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.3)'}`
                  }}>
                    Impact Severity: {sig.impact_score}/10
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#f3f4f6', fontWeight: 500 }}>
                "{sig.text}"
              </div>

              {/* Footer Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#60a5fa', fontWeight: 700 }}>
                    Target: {sig.target_company} ({sig.target_ticker})
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>Sector: {sig.sector}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isHighImpact && (
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                      onClick={() => onSelectSignalForStress(sig)}
                    >
                      <AlertTriangle size={12} /> Trigger Module B Stress Test
                    </button>
                  )}
                  <span style={{ color: 'var(--text-dim)' }}>{new Date(sig.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
