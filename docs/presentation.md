# Unified AI/NLP Financial Risk Engine & Analytics Platform
### S&P Global & CRISIL Campus Hackathon 2026

**Candidate Name:** Kottapally Sai Skrithik  
**College / Campus:** Indian Institute of Technology Patna (IIT Patna)  
**College Email ID:** [skrithik@iitp.ac.in]  
**Repository:** https://github.com/skrithik/IITPATNA-KOTTAPALLYSAISKRITHIK-hackathon  

---

## Slide 1: Title
* **Project Title:** Unified AI/NLP Financial Risk Engine & Interactive Analytics Platform
* **Candidate:** Kottapally Sai Skrithik (IIT Patna)
* **Event:** S&P Global & CRISIL Campus Hackathon 2026

---

## Slide 2: Problem Statement & Solution Approach
* **Business Challenge:** Financial institutions face high velocity, unstructured text data (news feeds, social media, earnings releases) that traditional risk models cannot parse rapidly. Delayed signal extraction leads to mispriced risk and delayed portfolio adjustments.
* **Our Approach:** Built a real-time, unified AI/NLP Risk Engine that ingests multi-source text, extracts entities (tickers), assigns sentiment scores (-1.0 to +1.0), classifies events into 8 categories, and predicts severity impact scores (1-10).
* **Dual Execution:** Integrated both downstream modules:
  * **Module A (Tactical Index Rebalancer):** Dynamically shifts stock weights in a $100M S&P 15 Index.
  * **Module B (Strategic Banking Stress Tester):** Triggers macro stress testing on a $1.25B Wholesale Banking asset portfolio.

---

## Slide 3: System Architecture & Data Pipeline
* **Ingestion Layer:** Multi-source ingestion pipeline (Reuters/WSJ news feeds, Twitter/X posts, live stream simulator).
* **AI/NLP Processing Unit:**
  * Sentiment Engine: FinLexicon + VADER polarity analyzer.
  * Entity Extractor: Ticker NER for mega-cap stocks (NVDA, AAPL, MSFT, JPM, XOM, etc.).
  * Event Classifier: Rule-based & semantic score matcher (Geopolitical, Macro, Credit, Regulatory, etc.).
  * Impact Predictor: Severity rating model (1-10).
* **API Signal Bus:** FastAPI REST endpoints + WebSockets/SSE stream.
* **Downstream Integration:** Automatic signal broadcast to Module A and Module B.

---

## Slide 4: Key Implementation Highlights & Tech Stack
* **Core Backend:** Python 3.14, FastAPI, Pydantic v2, VADER Sentiment, NumPy, Pandas.
* **Interactive Frontend:** React 18, Vite 5, Lucide Icons, Glassmorphism Dark Mode design system.
* **Resilient Architecture:** Real-time stream simulator + live news ingest fallback guarantees 100% execution offline and online.
* **Risk Controls:** Weight ceiling (15%) and floor (1.5%) caps in Module A to prevent portfolio concentration risk; Parametric 95% & 99% VaR in Module B.

---

## Slide 5: Key Results & Prototype Outputs
* **Processing Speed:** Ingests and structures unstructured news text in <15ms per signal.
* **Module A Performance:** Rebalanced $100M S&P index constituents efficiently, capping downside risk by underweighting sentiment-distressed stocks (e.g., MSFT DOJ investigation -0.82 sentiment -> reduced weight).
* **Module B Insights:** Successfully triggered automated stress tests for severe events (Impact >= 7.0), calculating exact portfolio drawdowns (-$84.2M on severe geopolitical shock) and 99% 1-Day VaR ($42.5M).

---

## Slide 6: Domain Impact & Business Value
* **Actionable Risk Signals:** Converts noisy unstructured news into machine-readable quantitative risk inputs.
* **Real-Time Rebalancing:** Enables high-frequency portfolio managers to rebalance tactical indices ahead of market open.
* **Wholesale Banking Capital Adequacy:** Assists CRISIL and S&P risk analysts in conducting instant event-driven Basel III scenario stress testing.

---

## Slide 7: Limitations & Future Enhancements
* **Current Limitations:** Uses rule-assisted VADER sentiment; sample portfolio size set to 15 stocks and 4 wholesale banking asset classes for hackathon prototype.
* **Next Steps:**
  1. Fine-tune FinBERT transformer models on domain-specific 10-K SEC filings.
  2. Expand live streaming ingestion to WebSockets & Apache Kafka topic streaming.
  3. Integrate real-time option chain volatility metrics (VIX & IV skew).
