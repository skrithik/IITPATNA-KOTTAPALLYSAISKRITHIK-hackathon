import re
import uuid
from datetime import datetime
from typing import Dict, Any, List, Tuple
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from src.engine.models import RawTextItem, RiskSignal

class NLPRiskEngine:
    def __init__(self):
        self.vader = SentimentIntensityAnalyzer()
        
        # Financial Ticker Mapping
        self.ticker_map = {
            "AAPL": {"name": "Apple Inc.", "sector": "Information Technology"},
            "APPLE": {"ticker": "AAPL", "name": "Apple Inc.", "sector": "Information Technology"},
            "MSFT": {"name": "Microsoft Corporation", "sector": "Information Technology"},
            "MICROSOFT": {"ticker": "MSFT", "name": "Microsoft Corporation", "sector": "Information Technology"},
            "GOOGL": {"name": "Alphabet Inc.", "sector": "Communication Services"},
            "GOOGLE": {"ticker": "GOOGL", "name": "Alphabet Inc.", "sector": "Communication Services"},
            "ALPHABET": {"ticker": "GOOGL", "name": "Alphabet Inc.", "sector": "Communication Services"},
            "AMZN": {"name": "Amazon.com Inc.", "sector": "Consumer Discretionary"},
            "AMAZON": {"ticker": "AMZN", "name": "Amazon.com Inc.", "sector": "Consumer Discretionary"},
            "AWS": {"ticker": "AMZN", "name": "Amazon.com Inc.", "sector": "Consumer Discretionary"},
            "NVDA": {"name": "NVIDIA Corporation", "sector": "Information Technology"},
            "NVIDIA": {"ticker": "NVDA", "name": "NVIDIA Corporation", "sector": "Information Technology"},
            "JPM": {"name": "JPMorgan Chase & Co.", "sector": "Financials"},
            "JPMORGAN": {"ticker": "JPM", "name": "JPMorgan Chase & Co.", "sector": "Financials"},
            "BAC": {"name": "Bank of America Corp.", "sector": "Financials"},
            "BANK OF AMERICA": {"ticker": "BAC", "name": "Bank of America Corp.", "sector": "Financials"},
            "GS": {"name": "Goldman Sachs Group Inc.", "sector": "Financials"},
            "GOLDMAN": {"ticker": "GS", "name": "Goldman Sachs Group Inc.", "sector": "Financials"},
            "MS": {"name": "Morgan Stanley", "sector": "Financials"},
            "MORGAN STANLEY": {"ticker": "MS", "name": "Morgan Stanley", "sector": "Financials"},
            "WMT": {"name": "Walmart Inc.", "sector": "Consumer Staples"},
            "WALMART": {"ticker": "WMT", "name": "Walmart Inc.", "sector": "Consumer Staples"},
            "PG": {"name": "Procter & Gamble Co.", "sector": "Consumer Staples"},
            "PROCTER": {"ticker": "PG", "name": "Procter & Gamble Co.", "sector": "Consumer Staples"},
            "JNJ": {"name": "Johnson & Johnson", "sector": "Healthcare"},
            "JOHNSON": {"ticker": "JNJ", "name": "Johnson & Johnson", "sector": "Healthcare"},
            "XOM": {"name": "Exxon Mobil Corp.", "sector": "Energy"},
            "EXXON": {"ticker": "XOM", "name": "Exxon Mobil Corp.", "sector": "Energy"},
            "CVX": {"name": "Chevron Corporation", "sector": "Energy"},
            "CHEVRON": {"ticker": "CVX", "name": "Chevron Corporation", "sector": "Energy"},
            "META": {"name": "Meta Platforms Inc.", "sector": "Communication Services"}
        }

        # Event Classification Lexicon
        self.event_categories = {
            "Geopolitical": [
                "geopolitical", "war", "conflict", "strait", "hormuz", "sanctions", 
                "tariff", "military", "defense", "missile", "embargo", "geopolitics"
            ],
            "Macroeconomic": [
                "federal reserve", "fed", "inflation", "rate hike", "interest rate", 
                "gdp", "cpi", "central bank", "liquidity", "recession", "50bps", "25bps"
            ],
            "Credit Event": [
                "credit rating", "downgrade", "default", "cre", "debt", "insolvency", 
                "bankrupt", "credit risk", "commercial real estate", "yield spread"
            ],
            "Merger/Acquisition": [
                "acquisition", "merger", "buyout", "takeover", "contract", "deal", 
                "joint venture", "divestiture", "buyout"
            ],
            "Product Launch": [
                "launch", "gpu", "blackwell", "chip", "quantum", "architecture", 
                "product", "breakthrough", "unveil", "innovation", "release"
            ],
            "Regulatory": [
                "antitrust", "investigation", "department of justice", "doj", "sec", 
                "lawsuit", "compliance", "fine", "penalty", "monopoly", "probe"
            ],
            "Supply Chain": [
                "supply chain", "strike", "port", "disruption", "inventory", 
                "logistics", "shipping", "shortage", "bottleneck", "delay"
            ],
            "Earnings/Financials": [
                "earnings", "revenue", "profit", "margin", "guidance", "q3", "q4", 
                "eps", "exceeded", "quarterly", "fiscal"
            ]
        }
        
        # Financial Lexicon Sentiment Weights
        self.custom_lexicon = {
            "soaring": 2.5, "breakthrough": 3.0, "stellar": 2.8, "exceeded": 2.2, 
            "surge": 2.0, "booming": 2.5, "outperform": 2.0, "antitrust": -3.0, 
            "investigation": -2.5, "downgrade": -3.2, "halt": -2.8, "disruption": -2.4, 
            "strike": -2.5, "panic": -3.5, "default": -3.8, "liquidity concerns": -3.0
        }
        self.vader.lexicon.update(self.custom_lexicon)

    def extract_entity(self, text: str) -> Tuple[str, str, str]:
        """Extract ticker, company name, and sector from text."""
        text_upper = text.upper()
        
        # 1. Direct Ticker search e.g. (NVDA) or $NVDA or NVDA
        for key in self.ticker_map:
            if len(key) <= 5:  # Ticker symbol check
                pattern = r'\b' + re.escape(key) + r'\b'
                if re.search(pattern, text_upper):
                    data = self.ticker_map[key]
                    ticker = data.get("ticker", key)
                    return ticker, data["name"], data["sector"]
        
        # 2. Company Name check
        for key in self.ticker_map:
            if len(key) > 5:
                if key.lower() in text.lower():
                    data = self.ticker_map[key]
                    ticker = data["ticker"]
                    return ticker, data["name"], data["sector"]

        return "MARKET", "Broad Market / Macro", "Macroeconomic"

    def analyze_sentiment(self, text: str) -> Tuple[float, str]:
        """Calculate sentiment score (-1.0 to 1.0) and categorical label."""
        vs = self.vader.polarity_scores(text)
        compound = vs['compound']
        
        # Additional financial context adjustment
        text_lower = text.lower()
        if "investigation" in text_lower or "antitrust" in text_lower or "downgrade" in text_lower:
            compound = min(compound, -0.4)
        if "stellar" in text_lower or "quantum" in text_lower or "soaring" in text_lower:
            compound = max(compound, 0.4)

        score = max(-1.0, min(1.0, round(compound, 2)))
        
        if score >= 0.15:
            label = "Positive"
        elif score <= -0.15:
            label = "Negative"
        else:
            label = "Neutral"
            
        return score, label

    def classify_event(self, text: str) -> Tuple[str, float]:
        """Categorize event type and return confidence score."""
        text_lower = text.lower()
        category_scores: Dict[str, float] = {}
        
        for category, keywords in self.event_categories.items():
            matches = sum(1 for kw in keywords if kw in text_lower)
            category_scores[category] = matches
        
        best_category = max(category_scores, key=category_scores.get)
        max_matches = category_scores[best_category]
        
        if max_matches == 0:
            return "Macroeconomic", 0.50
            
        confidence = min(0.98, round(0.50 + (max_matches * 0.15), 2))
        return best_category, confidence

    def predict_impact_score(self, text: str, category: str, sentiment_score: float) -> float:
        """Calculate severity impact score (1.0 to 10.0)."""
        base_impact_map = {
            "Geopolitical": 7.5,
            "Macroeconomic": 7.0,
            "Credit Event": 7.2,
            "Regulatory": 6.8,
            "Supply Chain": 6.0,
            "Merger/Acquisition": 6.2,
            "Earnings/Financials": 5.8,
            "Product Launch": 5.5
        }
        
        base = base_impact_map.get(category, 5.0)
        
        # Sentiment extremity modifier (+0 to +2.0)
        extremity = abs(sentiment_score) * 2.0
        
        # Urgent / High-impact keyword triggers
        text_lower = text.lower()
        keyword_boost = 0.0
        urgent_words = ["breaking", "surge", "soar", "investigation", "50bps", "halt", "downgrade", "strike", "antitrust", "unveil"]
        for word in urgent_words:
            if word in text_lower:
                keyword_boost += 0.4
                
        final_score = base + extremity + keyword_boost
        return max(1.0, min(10.0, round(final_score, 1)))

    def extract_keywords(self, text: str) -> List[str]:
        """Extract key risk indicators from text."""
        words = re.findall(r'\b[A-Za-z]{4,}\b', text)
        stop_words = {"this", "that", "with", "from", "have", "were", "been", "their", "which", "over", "into"}
        filtered = [w for w in words if w.lower() not in stop_words]
        return list(set(filtered))[:6]

    def process_item(self, item: RawTextItem) -> RiskSignal:
        """Process a raw news/tweet item and generate a structured Risk Signal."""
        ticker, company, sector = self.extract_entity(item.text)
        sentiment_score, sentiment_label = self.analyze_sentiment(item.text)
        category, confidence = self.classify_event(item.text)
        impact_score = self.predict_impact_score(item.text, category, sentiment_score)
        keywords = self.extract_keywords(item.text)
        
        risk_factors = []
        if sentiment_score < -0.3:
            risk_factors.append(f"High Negative Sentiment ({sentiment_score})")
        if impact_score >= 7.0:
            risk_factors.append(f"High Severity Impact ({impact_score}/10)")
        if category in ["Geopolitical", "Credit Event", "Regulatory"]:
            risk_factors.append(f"Systemic Event Category: {category}")
            
        timestamp_str = item.timestamp or datetime.utcnow().isoformat() + "Z"
        
        return RiskSignal(
            signal_id=f"SIG-{uuid.uuid4().hex[:8].upper()}",
            item_id=item.id,
            source_type=item.source_type,
            source_name=item.source_name,
            text=item.text,
            timestamp=timestamp_str,
            target_ticker=ticker,
            target_company=company,
            sector=sector,
            sentiment_score=sentiment_score,
            sentiment_label=sentiment_label,
            event_category=category,
            impact_score=impact_score,
            confidence_score=confidence,
            keywords=keywords,
            risk_factors=risk_factors
        )
