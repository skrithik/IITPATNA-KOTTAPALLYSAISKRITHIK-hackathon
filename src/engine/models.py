from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class RawTextItem(BaseModel):
    id: str
    source_type: str  # e.g., "Financial News", "Twitter/X", "RSS Feed", "User Direct Input"
    source_name: str
    text: str
    timestamp: Optional[str] = None

class RiskSignal(BaseModel):
    signal_id: str
    item_id: str
    source_type: str
    source_name: str
    text: str
    timestamp: str
    
    # NLP Engine Outputs
    target_ticker: Optional[str] = Field(description="Extracted stock symbol e.g., AAPL, NVDA, JPM")
    target_company: Optional[str] = Field(description="Extracted company name")
    sector: Optional[str] = Field(description="Industry sector of target company")
    
    sentiment_score: float = Field(ge=-1.0, le=1.0, description="Sentiment from -1.0 (extremely negative) to +1.0 (extremely positive)")
    sentiment_label: str = Field(description="Positive, Negative, or Neutral")
    
    event_category: str = Field(description="Geopolitical, Macroeconomic, Credit Event, Merger/Acquisition, Product Launch, Regulatory, Supply Chain, Earnings/Financials")
    impact_score: float = Field(ge=1.0, le=10.0, description="Predicted market severity from 1.0 to 10.0")
    confidence_score: float = Field(ge=0.0, le=1.0, description="Model classification confidence")
    
    keywords: List[str] = []
    risk_factors: List[str] = []

class RebalanceWeight(BaseModel):
    ticker: str
    name: str
    sector: str
    previous_weight: float
    new_weight: float
    weight_change_pct: float
    sentiment_score: float
    signal_count: int
    current_price: float

class RebalanceResponse(BaseModel):
    timestamp: str
    total_signals_processed: int
    portfolio_value_usd: float
    rebalanced_weights: List[RebalanceWeight]
    summary: str
    rebalance_history: List[Dict[str, Any]] = []

class StressTestRequest(BaseModel):
    signal_id: Optional[str] = None
    custom_category: Optional[str] = None
    custom_impact_score: Optional[float] = None
    equity_shock_pct: Optional[float] = None
    interest_rate_bp: Optional[float] = None
    credit_spread_bp: Optional[float] = None

class AssetClassStressResult(BaseModel):
    category: str
    pre_value_usd: float
    post_value_usd: float
    value_change_usd: float
    pct_change: float

class StressTestResponse(BaseModel):
    test_id: str
    timestamp: str
    triggered_by_event: str
    event_category: str
    impact_score: float
    pre_stress_total_usd: float
    post_stress_total_usd: float
    total_loss_usd: float
    total_loss_pct: float
    var_95_usd: float
    var_99_usd: float
    asset_breakdown: List[AssetClassStressResult]
    applied_shocks: Dict[str, Any]
    summary_report: str
