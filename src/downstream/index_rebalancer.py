import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any
from src.engine.models import RiskSignal, RebalanceWeight, RebalanceResponse

class TacticalIndexRebalancer:
    def __init__(self, index_file_path: str = "data/mock_s_and_p_index.json"):
        self.index_file_path = Path(index_file_path)
        self.portfolio_name = "S&P Dynamic Risk-Weighted Top 15"
        self.total_value_usd = 100000000.0  # $100 Million Portfolio
        self.constituents: List[Dict[str, Any]] = []
        self.rebalance_history: List[Dict[str, Any]] = []
        self._load_index_data()

    def _load_index_data(self):
        if self.index_file_path.exists():
            with open(self.index_file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.portfolio_name = data.get("index_name", self.portfolio_name)
                self.total_value_usd = data.get("total_value_usd", self.total_value_usd)
                self.constituents = data.get("constituents", [])

    def rebalance(self, signals: List[RiskSignal], sensitivity: float = 0.035) -> RebalanceResponse:
        """Dynamically adjust constituent stock weights based on accumulated sentiment signals."""
        # 1. Aggregate sentiment per ticker
        ticker_sentiment: Dict[str, List[float]] = {c["ticker"]: [] for c in self.constituents}
        
        for sig in signals:
            if sig.target_ticker in ticker_sentiment:
                ticker_sentiment[sig.target_ticker].append(sig.sentiment_score)

        # 2. Compute net raw target weight adjustments
        updated_weights: List[RebalanceWeight] = []
        raw_target_weights: Dict[str, float] = {}
        
        for c in self.constituents:
            ticker = c["ticker"]
            init_w = c["initial_weight"]
            s_list = ticker_sentiment[ticker]
            
            if s_list:
                avg_sentiment = sum(s_list) / len(s_list)
            else:
                avg_sentiment = 0.0
                
            # Weight adjustment formula:
            # Shift = avg_sentiment * sensitivity * (1 + 0.2 * beta)
            shift = avg_sentiment * sensitivity * (1.0 + 0.2 * c.get("beta", 1.0))
            raw_w = max(0.015, init_w + shift)  # Min 1.5% floor
            raw_target_weights[ticker] = min(0.15, raw_w)  # Max 15% ceiling

        # 3. Normalize weights to sum exactly to 1.0 (100%)
        total_raw = sum(raw_target_weights.values())
        normalized_weights: Dict[str, float] = {t: w / total_raw for t, w in raw_target_weights.items()}

        # 4. Construct response models
        for c in self.constituents:
            ticker = c["ticker"]
            prev_w = c["initial_weight"]
            new_w = round(normalized_weights[ticker], 4)
            s_list = ticker_sentiment[ticker]
            avg_s = round(sum(s_list) / len(s_list), 2) if s_list else 0.0
            
            chg_pct = round(((new_w - prev_w) / prev_w) * 100, 2)
            
            updated_weights.append(
                RebalanceWeight(
                    ticker=ticker,
                    name=c["name"],
                    sector=c["sector"],
                    previous_weight=prev_w,
                    new_weight=new_w,
                    weight_change_pct=chg_pct,
                    sentiment_score=avg_s,
                    signal_count=len(s_list),
                    current_price=c["current_price"]
                )
            )

        timestamp_str = datetime.utcnow().isoformat() + "Z"
        
        # 5. Log history entry
        history_entry = {
            "timestamp": timestamp_str,
            "signals_processed": len(signals),
            "top_increased": sorted(updated_weights, key=lambda x: x.weight_change_pct, reverse=True)[0].ticker,
            "top_decreased": sorted(updated_weights, key=lambda x: x.weight_change_pct)[0].ticker
        }
        self.rebalance_history.append(history_entry)

        summary = (
            f"Successfully rebalanced portfolio across {len(self.constituents)} assets based on {len(signals)} NLP signals. "
            f"Dynamic bounds enforced between 1.5% and 15.0% weight limits to optimize risk-adjusted returns."
        )

        return RebalanceResponse(
            timestamp=timestamp_str,
            total_signals_processed=len(signals),
            portfolio_value_usd=self.total_value_usd,
            rebalanced_weights=updated_weights,
            summary=summary,
            rebalance_history=self.rebalance_history
        )
