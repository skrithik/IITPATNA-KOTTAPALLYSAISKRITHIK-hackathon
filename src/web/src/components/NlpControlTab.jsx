import React, { useState } from 'react';
import { Cpu, Send, CheckCircle, Tag, AlertOctagon, BarChart2 } from 'lucide-react';

export default function NlpControlTab({ onAnalyzeText }) {
  const [inputText, setInputText] = useState('');
  const [sourceType, setSourceType] = useState('Financial News Feed');
  const [sourceName, setSourceName] = useState('Custom Terminal Ingest');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    "Geopolitical conflict escalates in Middle East; Brent Crude surges +6% impacting ExxonMobil (XOM) and Chevron (CVX).",
    "Department of Justice launches antitrust investigation into Alphabet (GOOGL) search monopoly.",
    "JPMorgan Chase (JPM) reports record net interest income of $22.8B, beating analyst estimates by 12%.",
    "East Coast port worker strike disrupts retail supply chains, forcing Walmart (WMT) to revise Q4 margin guidance."
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const sig = await onAnalyzeText({
        id: `USER-${Date.now()}`,
        source_type: sourceType,
        source_name: sourceName,
        text: inputText
      });
      setResult(sig);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title & Instructions */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu color="#ef4444" size={24} />
          Core AI/NLP Risk Engine Sandbox
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.6' }}>
          Input unstructured text from news feeds, social media, or SEC filings. The AI/NLP engine parses sentiment, extracts entity targets, classifies event categories, and predicts market impact scores in real time.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Input Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            Interactive Text Ingestion Form
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Source Category
              </label>
              <select 
                className="glass-input" 
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
              >
                <option value="Financial News Feed">Financial News Feed (Reuters / Bloomberg / WSJ)</option>
                <option value="Social Media (Twitter/X)">Social Media (Twitter/X Posts)</option>
                <option value="Social Media (StockTwits)">Social Media (StockTwits)</option>
                <option value="Regulatory / SEC Filing">Regulatory / SEC 8-K Filing</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Unstructured Text Content
              </label>
              <textarea
                className="glass-input"
                rows={5}
                placeholder="Type or paste financial headline, tweet, or press release here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Test Presets:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(preset)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '6px',
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    Preset #{idx+1}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '8px' }}>
              <Send size={16} /> {loading ? 'Processing Text...' : 'Run AI/NLP Engine Analysis'}
            </button>
          </form>
        </div>

        {/* Structured Output View */}
        <div className="glass-card" style={{ borderColor: result ? 'rgba(59, 130, 246, 0.4)' : 'var(--border-glass)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 color="#3b82f6" size={18} />
            Structured Risk Intelligence Output
          </h3>

          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Primary Scores Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SENTIMENT SCORE</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: result.sentiment_score >= 0 ? '#34d399' : '#f87171', marginTop: '2px' }}>
                    {result.sentiment_score >= 0 ? `+${result.sentiment_score}` : result.sentiment_score}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Classification: {result.sentiment_label}</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>IMPACT SEVERITY SCORE</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: result.impact_score >= 7 ? '#f87171' : '#60a5fa', marginTop: '2px' }}>
                    {result.impact_score}/10
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Category: {result.event_category}</div>
                </div>
              </div>

              {/* Extracted Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Entity:</span>
                  <span style={{ color: '#60a5fa', fontWeight: 700 }}>{result.target_company} ({result.target_ticker})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Industry Sector:</span>
                  <span style={{ color: 'var(--text-main)' }}>{result.sector}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Classification Confidence:</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{(result.confidence_score * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Risk Factors & Keywords */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Identified Risk Indicators:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {result.keywords.map((kw, i) => (
                    <span key={i} style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#93c5fd', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} /> Signal broadcast to Module A Rebalancer & Module B Stress Tester
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Cpu size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p>Submit text using the form to view real-time NLP signal extraction.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
