import React, { useState, useEffect } from 'react';
import { ShieldAlert, Play, AlertTriangle, DollarSign, Activity, FileText, CheckCircle } from 'lucide-react';

export default function StressTestTab({ selectedSignalForStress }) {
  const [stressResult, setStressResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Custom Shock Parameters
  const [category, setCategory] = useState('Geopolitical');
  const [equityShock, setEquityShock] = useState(-15);
  const [rateShock, setRateShock] = useState(75);
  const [spreadShock, setSpreadShock] = useState(150);

  const handleRunStressTest = async (reqBody = null) => {
    setLoading(true);
    try {
      const payload = reqBody || {
        custom_category: category,
        custom_impact_score: 8.5,
        equity_shock_pct: equityShock / 100.0,
        interest_rate_bp: rateShock,
        credit_spread_bp: spreadShock
      };

      const res = await fetch('/api/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setStressResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSignalForStress) {
      handleRunStressTest({ signal_id: selectedSignalForStress.signal_id });
    } else {
      handleRunStressTest();
    }
  }, [selectedSignalForStress]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', letterSpacing: '1px' }}>MODULE B</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '2px 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert color="#ef4444" size={24} />
              Strategic Wholesale Banking Portfolio Stress Testing Lab
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Simulates macroeconomic, geopolitical, and credit shock scenarios on a synthetic $1.25 Billion wholesale banking portfolio.
            </p>
          </div>

          <button className="btn-primary" onClick={() => handleRunStressTest()} disabled={loading}>
            <Play size={16} /> {loading ? 'Running Simulation...' : 'Run Scenario Stress Test'}
          </button>
        </div>
      </div>

      {/* Trigger Event Banner (if triggered by signal) */}
      {stressResult?.triggered_by_event && (
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle color="#f87171" size={20} />
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', textTransform: 'uppercase' }}>STRESS TEST SCENARIO TRIGGER</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
              {stressResult.triggered_by_event} (Impact Severity: {stressResult.impact_score}/10)
            </div>
          </div>
        </div>
      )}

      {/* Main KPI Results Grid */}
      {stressResult && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          <div className="glass-card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>PRE-STRESS PORTFOLIO VALUATION</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              ${(stressResult.pre_stress_total_usd / 1e6).toFixed(1)}M
            </div>
            <div style={{ fontSize: '11px', color: '#60a5fa', marginTop: '4px' }}>Base AUM Baseline</div>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>POST-STRESS PORTFOLIO VALUATION</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
              ${(stressResult.post_stress_total_usd / 1e6).toFixed(1)}M
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Post-Shock Valuation</div>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SIMULATED NET LOSS</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#f87171', marginTop: '4px' }}>
              -${(stressResult.total_loss_usd / 1e6).toFixed(2)}M
            </div>
            <div style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', fontWeight: 700 }}>
              Drawdown: {stressResult.total_loss_pct}%
            </div>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>VALUE AT RISK (1-DAY 99% VaR)</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
              ${(stressResult.var_99_usd / 1e6).toFixed(2)}M
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              95% VaR: ${(stressResult.var_95_usd / 1e6).toFixed(2)}M
            </div>
          </div>

        </div>
      )}

      {/* Asset Breakdown & Custom Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Asset Category Breakdown */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            Wholesale Asset Class Stress Sensitivity Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stressResult?.asset_breakdown.map((ac) => {
              const isNegative = ac.pct_change < 0;
              return (
                <div 
                  key={ac.category}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{ac.category}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Pre: ${(ac.pre_value_usd / 1e6).toFixed(1)}M → Post: ${(ac.post_value_usd / 1e6).toFixed(1)}M
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: isNegative ? '#f87171' : '#34d399' }}>
                      {isNegative ? `-$${(Math.abs(ac.value_change_usd) / 1e6).toFixed(2)}M` : `+$${(ac.value_change_usd / 1e6).toFixed(2)}M`}
                    </div>
                    <span className={isNegative ? 'badge badge-negative' : 'badge badge-positive'}>
                      {ac.pct_change}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Scenario Calibration Controls */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            Scenario Shock Parameters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Scenario Event Category
              </label>
              <select
                className="glass-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Geopolitical">Geopolitical Conflict Shock</option>
                <option value="Macroeconomic">Macroeconomic Rate Hike Cycle</option>
                <option value="Credit Event">Credit Downgrade Wave</option>
                <option value="Regulatory">Regulatory Crackdown Shock</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Equity Price Shock (% drop)
              </label>
              <input
                type="range"
                min="-30"
                max="0"
                value={equityShock}
                onChange={(e) => setEquityShock(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
              <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 700 }}>{equityShock}%</span>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Interest Rate Shift (bps hike)
              </label>
              <input
                type="range"
                min="0"
                max="250"
                step="25"
                value={rateShock}
                onChange={(e) => setRateShock(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#3b82f6' }}
              />
              <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 700 }}>+{rateShock} bps</span>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Credit Spread Widening (bps)
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="25"
                value={spreadShock}
                onChange={(e) => setSpreadShock(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
              <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>+{spreadShock} bps</span>
            </div>

            <button className="btn-secondary" onClick={() => handleRunStressTest()} style={{ justifyContent: 'center', marginTop: '8px' }}>
              Apply Custom Shock Scenario
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
