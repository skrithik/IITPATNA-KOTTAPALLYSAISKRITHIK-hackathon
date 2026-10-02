import json
import uuid
import numpy as np
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional
from src.engine.models import (
    RiskSignal, StressTestRequest, StressTestResponse, AssetClassStressResult
)

class WholesalePortfolioStressTester:
    def __init__(
        self, 
        portfolio_file_path: str = "data/banking_portfolio.json",
        scenarios_file_path: str = "data/stress_scenarios.json"
    ):
        self.portfolio_file_path = Path(portfolio_file_path)
        self.scenarios_file_path = Path(scenarios_file_path)
        
        self.portfolio_data: Dict[str, Any] = {}
        self.scenarios: List[Dict[str, Any]] = []
        self._load_data()

    def _load_data(self):
        if self.portfolio_file_path.exists():
            with open(self.portfolio_file_path, "r", encoding="utf-8") as f:
                self.portfolio_data = json.load(f)
                
        if self.scenarios_file_path.exists():
            with open(self.scenarios_file_path, "r", encoding="utf-8") as f:
                self.scenarios = json.load(f)

    def find_scenario_for_signal(self, signal: RiskSignal) -> Dict[str, Any]:
        """Match NLP signal event category and impact score to standard macro stress scenario."""
        for sc in self.scenarios:
            if sc["trigger_category"] == signal.event_category:
                return sc
                
        # Default scenario if no exact category match
        return {
            "scenario_id": "SCEN-GENERIC-99",
            "title": f"Adverse Market Event ({signal.event_category})",
            "trigger_category": signal.event_category,
            "min_impact_score": 7.0,
            "shocks": {
                "equity_price_pct_change": -0.10,
                "interest_rate_bp_change": 50,
                "credit_spread_bp_change": 100,
                "pd_multiplier": 1.50
            }
        }

    def run_stress_test(
        self, 
        signal: Optional[RiskSignal] = None,
        custom_request: Optional[StressTestRequest] = None
    ) -> StressTestResponse:
        """Run event-driven stress test simulation on wholesale banking portfolio."""
        # Determine scenario parameters
        if custom_request and (custom_request.custom_category or custom_request.equity_shock_pct is not None):
            event_name = f"Custom Simulation ({custom_request.custom_category or 'Custom Macro'})"
            event_cat = custom_request.custom_category or "Macroeconomic"
            impact_sc = custom_request.custom_impact_score or 8.0
            shocks = {
                "equity_price_pct_change": custom_request.equity_shock_pct if custom_request.equity_shock_pct is not None else -0.15,
                "interest_rate_bp_change": custom_request.interest_rate_bp if custom_request.interest_rate_bp is not None else 75,
                "credit_spread_bp_change": custom_request.credit_spread_bp if custom_request.credit_spread_bp is not None else 120,
                "pd_multiplier": 1.60
            }
        elif signal:
            scenario = self.find_scenario_for_signal(signal)
            event_name = f"Signal {signal.signal_id}: {signal.event_category} ({signal.target_ticker or 'Global Market'})"
            event_cat = signal.event_category
            impact_sc = signal.impact_score
            shocks = scenario["shocks"]
        else:
            # Default fallback severe scenario
            event_name = "Baseline Severe Macroeconomic Shock"
            event_cat = "Macroeconomic"
            impact_sc = 8.5
            shocks = self.scenarios[0]["shocks"]

        total_pre_val = self.portfolio_data.get("total_aum_usd", 1250000000.0)
        asset_classes = self.portfolio_data.get("asset_classes", [])

        eq_shock = shocks.get("equity_price_pct_change", -0.10)
        rate_shock_bp = shocks.get("interest_rate_bp_change", 50)
        spread_shock_bp = shocks.get("credit_spread_bp_change", 100)
        pd_mult = shocks.get("pd_multiplier", 1.50)

        breakdown: List[AssetClassStressResult] = []
        total_post_val = 0.0

        for ac in asset_classes:
            cat_name = ac["category"]
            cat_pre_val = ac["total_value_usd"]
            cat_post_val = cat_pre_val

            if "Loans" in cat_name:
                # Credit loss simulation: PD increase * LGD
                additional_loss_pct = (pd_mult - 1.0) * 0.035
                cat_post_val = cat_pre_val * (1.0 - additional_loss_pct)
                
            elif "Bonds" in cat_name:
                # Duration valuation haircut: DV01 * Rate_shock_bp + Spread_shock
                rate_haircut_pct = (rate_shock_bp / 10000.0) * 6.5
                spread_haircut_pct = (spread_shock_bp / 10000.0) * 4.0
                total_bond_haircut = rate_haircut_pct + spread_haircut_pct
                cat_post_val = cat_pre_val * (1.0 - total_bond_haircut)

            elif "Derivatives" in cat_name:
                # Mark-to-market derivative volatility loss
                mtm_shock_pct = abs(spread_shock_bp / 10000.0) * 2.5
                cat_post_val = cat_pre_val * (1.0 - mtm_shock_pct)

            elif "Equities" in cat_name:
                # Equity shock application
                cat_post_val = cat_pre_val * (1.0 + eq_shock)

            cat_loss = cat_pre_val - cat_post_val
            pct_chg = round(((cat_post_val - cat_pre_val) / cat_pre_val) * 100, 2)

            breakdown.append(
                AssetClassStressResult(
                    category=cat_name,
                    pre_value_usd=round(cat_pre_val, 2),
                    post_value_usd=round(cat_post_val, 2),
                    value_change_usd=round(-cat_loss, 2),
                    pct_change=pct_chg
                )
            )

            total_post_val += cat_post_val

        total_loss = total_pre_val - total_post_val
        total_loss_pct = round((total_loss / total_pre_val) * 100, 2)

        # Compute Value at Risk (VaR 95% and 99%) via parametric distribution simulation
        sigma = (abs(total_loss_pct) / 100.0) * 0.65
        var_95 = round(total_pre_val * (1.645 * sigma), 2)
        var_99 = round(total_pre_val * (2.326 * sigma), 2)

        timestamp_str = datetime.utcnow().isoformat() + "Z"
        
        summary = (
            f"STRESS TEST COMPLETE: Triggered by '{event_name}' (Impact: {impact_sc}/10). "
            f"Wholesale Banking Portfolio total value shifted from ${total_pre_val/1e6:.1f}M to ${total_post_val/1e6:.1f}M, "
            f"incurring a simulated net valuation reduction of ${total_loss/1e6:.2f}M ({total_loss_pct}%). "
            f"Estimated 1-Day 95% VaR: ${var_95/1e6:.2f}M | 99% VaR: ${var_99/1e6:.2f}M."
        )

        return StressTestResponse(
            test_id=f"STRESS-{uuid.uuid4().hex[:8].upper()}",
            timestamp=timestamp_str,
            triggered_by_event=event_name,
            event_category=event_cat,
            impact_score=impact_sc,
            pre_stress_total_usd=round(total_pre_val, 2),
            post_stress_total_usd=round(total_post_val, 2),
            total_loss_usd=round(total_loss, 2),
            total_loss_pct=total_loss_pct,
            var_95_usd=var_95,
            var_99_usd=var_99,
            asset_breakdown=breakdown,
            applied_shocks=shocks,
            summary_report=summary
        )
