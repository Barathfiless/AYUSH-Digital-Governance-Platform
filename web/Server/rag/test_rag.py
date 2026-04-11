"""
Live test cases for the AYUSH RAG system.
Run: python test_rag.py
"""
import urllib.request
import json

def post(path, body):
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        f"http://localhost:5001{path}",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

def get(path):
    with urllib.request.urlopen(f"http://localhost:5001{path}", timeout=10) as r:
        return json.loads(r.read())

LINE = "=" * 65

def run_test(label, path, body, method="POST"):
    q = body.get("query", "")
    print(f"\n[{label}]")
    print(f"  USER ASKS : {q}")
    r = post(path, body) if method == "POST" else get(path)
    ans = r.get("answer", "")[:300]
    prods = r.get("products", [])
    source = r.get("source", "")
    conf = r.get("confidence", "")
    print(f"  RAG SAYS  : {ans}")
    if source:
        print(f"  Source    : {source}")
    if conf:
        print(f"  Confidence: {conf}")
    if prods:
        print(f"  Products found: {[p.get('name','?') for p in prods[:3]]}")
    print("-" * 65)

if __name__ == "__main__":
    print(LINE)
    print("  AYUSH GATEWAY - RAG LIVE TEST CASES")
    print(LINE)

    # ── Status check ──────────────────────────────────────────
    status = get("/rag/status")
    print(f"\n  RAG Status  : {status['status'].upper()}")
    print(f"  Embedding   : {status['model']}")
    print(f"  Vector DB   : {status['vector_db']}")
    print(f"  API Keys    : {status['api_keys']}")
    print(f"  Products indexed : {status['collections']['products']}")
    print(f"  Guidance chunks  : {status['collections']['guidance']}")
    print(f"  Reviews indexed  : {status['collections']['reviews']}")
    print(LINE)

    # ── TEST 1: Customer chat – stress/sleep ───────────────────
    run_test(
        "TEST 1 - Customer asks about stress & sleep",
        "/rag/chat",
        {"query": "I have stress and sleep problems. What Ayurvedic herbs help?"}
    )

    # ── TEST 2: Customer chat – immunity ──────────────────────
    run_test(
        "TEST 2 - Immunity booster question",
        "/rag/chat",
        {"query": "Which AYUSH products boost immunity and fight infections?"}
    )

    # ── TEST 3: Customer chat – joint pain ────────────────────
    run_test(
        "TEST 3 - Joint pain remedy",
        "/rag/chat",
        {"query": "My grandmother has knee joint pain. What Ayurvedic oil or herb helps?"}
    )

    # ── TEST 4: Guidance – License query ─────────────────────
    run_test(
        "TEST 4 - Manufacturer asks: What documents for AYUSH license?",
        "/rag/guidance",
        {"query": "What documents are required to apply for an AYUSH product license?"}
    )

    # ── TEST 5: Guidance – How long review takes ─────────────
    run_test(
        "TEST 5 - How long does approval take?",
        "/rag/guidance",
        {"query": "How long does the AYUSH license application review process take?"}
    )

    # ── TEST 6: Guidance – Siddha vs Ayurveda ────────────────
    run_test(
        "TEST 6 - What is Siddha medicine?",
        "/rag/guidance",
        {"query": "What is Siddha medicine and how is it different from Ayurveda?"}
    )

    # ── TEST 7: Guidance – Quality standards ─────────────────
    run_test(
        "TEST 7 - AYUSH product quality standards",
        "/rag/guidance",
        {"query": "What quality tests are required for AYUSH certified products?"}
    )

    # ── TEST 8: Index a sample review and summarize ───────────
    print("\n[TEST 8 - Index a review then summarize it]")
    print("  ACTION    : Submitting a sample review for product 'DEMO-001'")
    post("/rag/index/reviews", {
        "product_id": "DEMO-001",
        "reviews": [
            {"comment": "Excellent Ashwagandha capsules, my stress reduced significantly after 2 weeks.", "rating": 5, "sentiment": "positive"},
            {"comment": "Good product but packaging could be better. Works well for sleep issues.", "rating": 4, "sentiment": "positive"},
            {"comment": "Average quality, did not feel much difference for my anxiety.", "rating": 3, "sentiment": "neutral"},
        ]
    })
    summary = post("/rag/reviews/summary", {"product_id": "DEMO-001", "query": "quality and effectiveness"})
    print(f"  SUMMARY   : {summary.get('answer')}")
    print(f"  Avg Rating: {summary.get('avg_rating')}/5")
    print(f"  Positive  : {summary.get('positive_pct')}%")
    print(f"  Total Rev : {summary.get('total_reviews')}")
    print("-" * 65)

    print("\n✅ ALL TESTS COMPLETE")
    print(LINE)
