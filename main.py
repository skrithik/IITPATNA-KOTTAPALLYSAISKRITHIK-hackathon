import uvicorn
import sys
import os

if __name__ == "__main__":
    print("=" * 70)
    print("  S&P Global & CRISIL Campus Hackathon 2026")
    print("  AI/NLP Financial Risk Engine & Interactive Analytics Platform")
    print("=" * 70)
    print("  Starting FastAPI Server on http://127.0.0.1:8000 ...")
    print("  API Documentation available at: http://127.0.0.1:8000/docs")
    print("=" * 70)
    
    uvicorn.run("src.api.server:app", host="127.0.0.1", port=8000, reload=True)
