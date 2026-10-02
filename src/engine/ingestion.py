import json
import random
import time
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional
import requests
from src.engine.models import RawTextItem

class DataIngestionEngine:
    def __init__(self, data_file_path: str = "data/sample_news_tweets.json"):
        self.data_file_path = Path(data_file_path)
        self.sample_items: List[RawTextItem] = []
        self._load_sample_data()

    def _load_sample_data(self):
        if self.data_file_path.exists():
            with open(self.data_file_path, "r", encoding="utf-8") as f:
                raw_data = json.load(f)
                for item in raw_data:
                    self.sample_items.append(
                        RawTextItem(
                            id=item["id"],
                            source_type=item["source_type"],
                            source_name=item["source_name"],
                            text=item["text"],
                            timestamp=item.get("timestamp")
                        )
                    )

    def get_all_sample_items(self) -> List[RawTextItem]:
        """Returns all pre-loaded news and tweets."""
        return self.sample_items

    def fetch_live_news_api(self, api_key: Optional[str] = None, query: str = "finance OR stock OR fed") -> List[RawTextItem]:
        """Fetch live news from NewsAPI (if API key provided) with graceful fallback."""
        if not api_key:
            return self.sample_items[:4]
            
        url = f"https://newsapi.org/v2/everything?q={query}&sortBy=publishedAt&pageSize=5&apiKey={api_key}"
        try:
            res = requests.get(url, timeout=5)
            if res.status_code == 200:
                articles = res.json().get("articles", [])
                items = []
                for i, art in enumerate(articles):
                    items.append(
                        RawTextItem(
                            id=f"LIVE-NEWS-{i+1}",
                            source_type="Live Financial News (NewsAPI)",
                            source_name=art.get("source", {}).get("name", "Financial News"),
                            text=f"{art.get('title', '')}. {art.get('description', '')}",
                            timestamp=art.get("publishedAt")
                        )
                    )
                return items
        except Exception as e:
            print(f"[IngestionEngine] NewsAPI Fetch error: {e}")
            
        return self.sample_items[:4]

    def generate_random_simulated_stream_item(self) -> RawTextItem:
        """Simulate real-time incoming market feed item."""
        tickers = ["NVDA", "AAPL", "MSFT", "AMZN", "JPM", "BAC", "XOM", "CVX", "WMT", "GOOGL"]
        events = [
            ("Financial News Feed", "Bloomberg", "{ticker} reports surprise breakthrough in operational efficiency, expanding guidance."),
            ("Social Media (Twitter/X)", "@MarketWatch_Alert", "Unconfirmed rumors of SEC inquiry into {ticker} accounting practices causing short-term pullback."),
            ("Financial News Feed", "Reuters", "Central bank comments trigger sector rotation; heavy volume detected in {ticker} options."),
            ("Social Media (StockTwits)", "@CryptoEquityGuy", "BULLISH! {ticker} announces strategic partnership with leading AI infrastructure provider.")
        ]
        
        t = random.choice(tickers)
        stype, sname, tmpl = random.choice(events)
        text = tmpl.format(ticker=t)
        
        return RawTextItem(
            id=f"SIM-{int(time.time() * 1000)}",
            source_type=stype,
            source_name=sname,
            text=text,
            timestamp=datetime.utcnow().isoformat() + "Z"
        )
