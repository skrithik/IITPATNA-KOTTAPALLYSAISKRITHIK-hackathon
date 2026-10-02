import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, TrendingUp, TrendingDown, CheckCircle, PieChart } from 'lucide-react';

export default function RebalancerTab({ signals }) {
  const [rebalanceData, setRebalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.035);

  const handleRunRebalance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rebalance?sensitivity=${sensitivity}`);
      const data = await res.json();
      setRebalanceData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (signals.length > 0) {
      handleRunRebalance();
    }
  }, [signals]);

  const topIncreased = rebalanceData?.rebalanced_weights
    ? [...rebalanceData.rebalanced_weights].sort((a, b) => b.weight_change_pct - a.weight_change_pct).slice(0, 3)
    : [];

  const topDecreased = rebalanceData?.rebalanced_weights
    ? [...rebalanceData.rebalanced_weights].sort((a, b) => a.weight_change_pct - b.weight_change_pct).slice(0, 3)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', letterSpacing: '1px' }}>MODULE A</span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '2px 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders color="#ef4444" size={24} />
            Tactical High-Frequency Index Rebalancer
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Dynamically shifts constituent stock allocations in a $100M S&P index based on NLP sentiment signals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Rebalance Sensitivity</label>
            <input
              type="range"
              min="0.01"
              max="0.08"
              step="0.005"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              style={{ accentColor: '#ef4444', width: '120px' }}
            />
            <span style={{ fontSize: '12px', color: '#f87171', marginLeft: '6px', fontWeight: 700 }}>{(sensitivity * 100).toFixed(1)}%</span>
          </div>

          <button className="btn-primary" onClick={handleRunRebalance} disabled={loading}>
            <RefreshCw size={16} /> {loading ? 'Rebalancing...' : 'Execute Dynamic Rebalance'}
          </button>
        </div>
      </div>

      {/* Top Rebalance Highlights */}
      {rebalanceData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          
          <div className="glass-card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>PROCESSED NLP SIGNALS</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {rebalanceData.total_signals_processed} Signals
            </div>
            <div style={{ fontSize: '12px', color: '#60a5fa', marginTop: '4px' }}>
              Dynamic Weight Limits: 1.5% to 15.0%
            </div>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOP OVERWEIGHT ALLOCATIONS</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              {topIncreased.map(w => (
                <span key={w.ticker} style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                  {w.ticker}: +{w.weight_change_pct}%
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOP UNDERWEIGHT REDUCTIONS</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              {topDecreased.map(w => (
                <span key={w.ticker} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                  {w.ticker}: {w.weight_change_pct}%
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Constituents Rebalanced Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart color="#ef4444" size={18} />
          S&P Index Constituent Weights & Rebalance Ledger
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Ticker</th>
                <th style={{ padding: '12px 16px' }}>Company Name</th>
                <th style={{ padding: '12px 16px' }}>Sector</th>
                <th style={{ padding: '12px 16px' }}>Sentiment</th>
                <th style={{ padding: '12px 16px' }}>Previous Weight</th>
                <th style={{ padding: '12px 16px' }}>Rebalanced Target</th>
                <th style={{ padding: '12px 16px' }}>Shift %</th>
                <th style={{ padding: '12px 16px' }}>Allocation Bar</th>
              </tr>
            </thead>
            <tbody>
              {rebalanceData?.rebalanced_weights.map(item => {
                const prevPct = (item.previous_weight * 100).toFixed(1);
                const newPct = (item.new_weight * 100).toFixed(1);
                const isIncreased = item.weight_change_pct > 0;
                
                return (
                  <tr key={item.ticker} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#ffffff' }}>{item.ticker}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{item.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{item.sector}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={item.sentiment_score >= 0.1 ? 'badge badge-positive' : item.sentiment_score <= -0.1 ? 'badge badge-negative' : 'badge badge-neutral'}>
                        {item.sentiment_score >= 0 ? `+${item.sentiment_score}` : item.sentiment_score}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{prevPct}%</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: isIncreased ? '#34d399' : item.weight_change_pct < 0 ? '#f87171' : '#ffffff' }}>
                      {newPct}%
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: isIncreased ? '#34d399' : item.weight_change_pct < 0 ? '#f87171' : 'var(--text-muted)' }}>
                      {isIncreased ? `+${item.weight_change_pct}%` : `${item.weight_change_pct}%`}
                    </td>
                    <td style={{ padding: '12px 16px', width: '180px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '8px', width: '100%', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${Math.min(100, item.new_weight * 600)}%`, 
                            background: isIncreased ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }} 
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
