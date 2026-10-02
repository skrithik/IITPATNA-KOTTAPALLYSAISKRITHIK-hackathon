import os
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from src.engine.models import (
    RawTextItem, RiskSignal, RebalanceResponse, StressTestRequest, StressTestResponse
)
from src.engine.nlp_risk_engine import NLPRiskEngine
from src.engine.ingestion import DataIngestionEngine
from src.downstream.index_rebalancer import TacticalIndexRebalancer
from src.downstream.stress_tester import WholesalePortfolioStressTester

app = FastAPI(
    title="S&P Global AI/NLP Financial Risk Engine & Analytics Platform",
    description="Unified real-time unstructured data risk engine powering Module A (Tactical Index Rebalancer) and Module B (Wholesale Banking Stress Testing).",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Services
nlp_engine = NLPRiskEngine()
ingestion_engine = DataIngestionEngine()
rebalancer = TacticalIndexRebalancer()
stress_tester = WholesalePortfolioStressTester()

# Global memory storage for active signals
processed_signals: List[RiskSignal] = []

def _initialize_signals():
    """Process initial sample news and tweets on startup."""
    global processed_signals
    sample_items = ingestion_engine.get_all_sample_items()
    for item in sample_items:
        sig = nlp_engine.process_item(item)
        processed_signals.append(sig)

_initialize_signals()

@app.get("/api/system/health")
def system_health():
    return {
        "status": "online",
        "service": "AI/NLP Financial Risk Engine",
        "active_signals_count": len(processed_signals),
        "modules_active": ["NLP Engine", "Module A (Index Rebalancer)", "Module B (Stress Tester)"]
    }

@app.get("/api/signals", response_model=List[RiskSignal])
def get_signals(limit: int = 50):
    """Retrieve processed structured risk signals."""
    return processed_signals[-limit:]

@app.post("/api/ingest/analyze", response_model=RiskSignal)
def analyze_text(item: RawTextItem):
    """Ingest raw text item (news headline or tweet) and generate structured risk signal."""
    sig = nlp_engine.process_item(item)
    processed_signals.append(sig)
    
    # Auto-trigger stress test if impact >= 7.0
    if sig.impact_score >= 7.0:
        stress_tester.run_stress_test(signal=sig)
        
    return sig

@app.get("/api/stream/simulated", response_model=RiskSignal)
def get_simulated_stream():
    """Simulate receiving a live streaming news item or tweet."""
    raw_item = ingestion_engine.generate_random_simulated_stream_item()
    sig = nlp_engine.process_item(raw_item)
    processed_signals.append(sig)
    return sig

@app.get("/api/rebalance", response_model=RebalanceResponse)
def run_index_rebalance(sensitivity: float = 0.035):
    """Run Module A Tactical High-Frequency Index Rebalancer."""
    if not processed_signals:
        raise HTTPException(status_code=400, detail="No processed signals available for rebalancing.")
    return rebalancer.rebalance(processed_signals, sensitivity=sensitivity)

@app.post("/api/stress-test", response_model=StressTestResponse)
def run_stress_test(request: Optional[StressTestRequest] = None):
    """Run Module B Wholesale Banking Portfolio Stress Testing."""
    if request and request.signal_id:
        target_sig = next((s for s in processed_signals if s.signal_id == request.signal_id), None)
        if target_sig:
            return stress_tester.run_stress_test(signal=target_sig)
            
    # Default or custom scenario stress test
    high_impact_sig = next((s for s in reversed(processed_signals) if s.impact_score >= 7.0), None)
    return stress_tester.run_stress_test(signal=high_impact_sig, custom_request=request)

@app.get("/api/index")
def get_index_constituents():
    """Retrieve S&P index constituents and base portfolio data."""
    return {
        "index_name": rebalancer.portfolio_name,
        "total_value_usd": rebalancer.total_value_usd,
        "constituents": rebalancer.constituents
    }

@app.get("/api/portfolio")
def get_banking_portfolio():
    """Retrieve synthetic wholesale banking asset portfolio."""
    return stress_tester.portfolio_data

# Static files hosting (for built web UI)
web_build_dir = Path("src/web/dist")
if web_build_dir.exists():
    app.mount("/assets", StaticFiles(directory=web_build_dir / "assets"), name="assets")
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = web_build_dir / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(web_build_dir / "index.html")
