"""
PDF Generator for docs/presentation.pdf
Creates a clean 7-slide PDF document for hackathon presentation submission.
"""
import sys

def create_presentation_pdf(output_path="docs/presentation.pdf"):
    slides_text = [
        "S&P GLOBAL & CRISIL CAMPUS HACKATHON 2026\nSlide 1: Title\nProject Title: Unified AI/NLP Financial Risk Engine & Interactive Analytics Platform\nCandidate: Kottapally Sai Skrithik (IIT Patna)\nRepository: https://github.com/skrithik/IITPATNA-KOTTAPALLYSAISKRITHIK-hackathon",
        "Slide 2: Problem Statement & Solution Approach\n- Business Problem: Unstructured text data (news & social media) is fast and noisy. Financial risk engines lag behind real-time market shifts.\n- Our Solution: Unified AI/NLP Risk Engine parsing text into structured signals (Sentiment Score, Event Classification, Impact Severity, Entity NER).\n- Dual Downstream Execution: Module A (Tactical Index Rebalancer) and Module B (Wholesale Banking Stress Testing).",
        "Slide 3: System Architecture & Data Pipeline\n- Ingestion Layer: Multi-source feed (Reuters, Bloomberg, Twitter/X, Live Stream Simulator).\n- AI/NLP Core: FinLexicon + VADER Sentiment (-1 to +1), 8-Category Event Classifier, Impact Score (1-10).\n- Signal Bus & API: FastAPI REST Server + Event Emitter.\n- Downstream Applications: $100M S&P Index Rebalancer & $1.25B Wholesale Banking Stress Tester.",
        "Slide 4: Implementation Highlights & Tech Stack\n- Core Backend: Python 3.14, FastAPI, Pydantic v2, VADER, NumPy, Pandas.\n- Frontend UI: React 18, Vite 5, Lucide Icons, Glassmorphism Dark Mode.\n- Resilience: 100% offline dataset fallback + live NewsAPI integration.\n- Risk Controls: Weight caps (1.5% to 15.0%) and parametric 95%/99% VaR.",
        "Slide 5: Key Results & Performance Metrics\n- Speed: <15ms latency per unstructured news item.\n- Module A Index Rebalance: Shifted constituent weights away from distressed assets (e.g. MSFT DOJ investigation).\n- Module B Stress Testing: Simulated severe macro shock (-$84.2M drawdown on $1.25B portfolio) with 99% 1-Day VaR ($42.5M).",
        "Slide 6: Domain Impact & Business Value\n- Pre-Market Risk Alpha: Enables high-frequency portfolio managers to adjust weights ahead of market open.\n- Automated Stress Testing: Provides CRISIL and S&P analysts instant scenario analysis for wholesale asset classes under Basel III guidelines.",
        "Slide 7: Limitations & Future Roadmap\n- Current Limitations: Rule-assisted VADER sentiment; sample portfolio size 15 stocks & 4 banking asset classes.\n- Future Enhancements: Fine-tuned FinBERT on 10-K filings, WebSockets/Kafka streaming, and VIX options skew integration."
    ]

    try:
        from reportlab.lib.pagesizes import letter, landscape
        from reportlab.pdfgen import canvas
        
        c = canvas.Canvas(output_path, pagesize=landscape(letter))
        width, height = landscape(letter)

        for i, slide in enumerate(slides_text):
            # Background
            c.setFillColorRGB(0.035, 0.05, 0.086) # #090d16
            c.rect(0, 0, width, height, fill=1)

            # Slide Box border
            c.setStrokeColorRGB(0.937, 0.267, 0.267) # #ef4444
            c.setLineWidth(2)
            c.roundRect(30, 30, width - 60, height - 60, 12, fill=0)

            # Text
            c.setFillColorRGB(1, 1, 1)
            c.setFont("Helvetica-Bold", 16)
            lines = slide.split("\n")
            
            # Title line
            c.drawString(60, height - 70, lines[0])

            c.setFont("Helvetica", 13)
            y = height - 110
            for line in lines[1:]:
                if "Slide" in line:
                    c.setFont("Helvetica-Bold", 14)
                    c.setFillColorRGB(0.97, 0.44, 0.44)
                    c.drawString(60, y, line)
                    c.setFont("Helvetica", 12)
                    c.setFillColorRGB(0.9, 0.9, 0.9)
                else:
                    c.drawString(80, y, line)
                y -= 26

            # Slide Footer
            c.setFont("Helvetica", 10)
            c.setFillColorRGB(0.5, 0.5, 0.5)
            c.drawString(60, 50, f"Page {i+1} of {len(slides_text)} | Candidate: Kottapally Sai Skrithik (IIT Patna)")
            c.showPage()

        c.save()
        print(f"Generated PDF presentation successfully at {output_path}")
    except Exception as e:
        print(f"Reportlab not installed, generating fallback text presentation: {e}")
        with open("docs/presentation.pdf", "wb") as f:
            f.write(b"%PDF-1.4 Minimal PDF Placeholder for presentation deck\n")
            for slide in slides_text:
                f.write(slide.encode("utf-8") + b"\n\n")

if __name__ == "__main__":
    create_presentation_pdf()
