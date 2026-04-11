"""
AYUSH Gateway - RAG Service
-------------------------------------------------
100% Offline RAG using:
  - sentence-transformers  (local embeddings)
  - chromadb               (local vector store)
  - Template-based generation (no LLM API needed)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import os
import json
import re
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"])

# ─────────────────────────────────────────
# Globals – loaded once at startup
# ─────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR   = os.path.join(BASE_DIR, "chroma_db")
os.makedirs(DB_DIR, exist_ok=True)

print("⚙️  Loading embedding model (first run downloads ~90 MB)...")
embedder = SentenceTransformer("all-MiniLM-L6-v2")   # fast, 80 MB, fully offline after 1st run
print("✅  Embedding model ready.")

chroma_client = chromadb.PersistentClient(path=DB_DIR)

products_col  = chroma_client.get_or_create_collection("ayush_products")
reviews_col   = chroma_client.get_or_create_collection("ayush_reviews")
guidance_col  = chroma_client.get_or_create_collection("ayush_guidance")

# ─────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────

def embed(text: str):
    return embedder.encode(text).tolist()


def retrieve(collection, query: str, n: int = 5):
    """Semantic retrieval from a ChromaDB collection."""
    if collection.count() == 0:
        return []
    results = collection.query(
        query_embeddings=[embed(query)],
        n_results=min(n, collection.count()),
        include=["documents", "metadatas", "distances"]
    )
    hits = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        hits.append({"text": doc, "meta": meta, "score": round(1 - dist, 3)})
    return hits

# ─────────────────────────────────────────
# Template-based answer generator
# (No LLM API required)
# ─────────────────────────────────────────

AYUSH_KNOWLEDGE = {
    "digestion": ["Triphala", "Hingvastak churna", "Digestive herbs"],
    "immunity":  ["Ashwagandha", "Tulsi", "Giloy", "Amla"],
    "stress":    ["Ashwagandha", "Brahmi", "Shankhpushpi"],
    "joint":     ["Mahanarayan oil", "Guggul", "Boswellia"],
    "skin":      ["Neem", "Turmeric", "Kumkumadi oil"],
    "sleep":     ["Brahmi", "Ashwagandha", "Jatamansi"],
    "diabetes":  ["Karela", "Fenugreek", "Vijaysar"],
    "hair":      ["Bhringraj", "Amla", "Brahmi oil"],
    "weight":    ["Triphala", "Guggul", "Garcinia"],
    "ayush":     ["Ayurveda", "Yoga", "Unani", "Siddha", "Homeopathy"],
}

def generate_answer(query: str, hits: list, context_type: str = "product") -> dict:
    """
    Use retrieved chunks + keyword knowledge to generate a structured answer.
    Zero LLM calls – pure template generation.
    """
    q_lower = query.lower()

    if context_type == "product":
        if not hits:
            # Keyword fallback from built-in AYUSH knowledge
            suggestions = []
            for keyword, herbs in AYUSH_KNOWLEDGE.items():
                if keyword in q_lower:
                    suggestions.extend(herbs)
            if suggestions:
                return {
                    "answer": f"Based on AYUSH traditional knowledge, these herbs may help: {', '.join(set(suggestions))}. Search our store for certified products.",
                    "products": [],
                    "source": "AYUSH Knowledge Base",
                    "confidence": "moderate"
                }
            return {
                "answer": "I couldn't find specific products. Try searching for common AYUSH ingredients like Ashwagandha, Triphala, or Giloy.",
                "products": [],
                "source": "AYUSH Knowledge Base",
                "confidence": "low"
            }

        # Build answer from retrieved products
        top_products = [h["meta"] for h in hits[:3]]
        names = [p.get("name", "Unknown") for p in top_products]
        stores = list(set([p.get("store", "") for p in top_products if p.get("store")]))
        categories = list(set([p.get("category", "") for p in top_products if p.get("category")]))

        answer_parts = [
            f"I found {len(hits)} relevant AYUSH-certified products for your query.",
            f"Top recommendations: **{', '.join(names[:3])}**.",
        ]
        if categories:
            answer_parts.append(f"These fall under: {', '.join(categories)}.")
        if stores:
            answer_parts.append(f"Available at: {', '.join(stores[:2])} and other certified stores.")
        answer_parts.append("All products listed are AYUSH-ministry approved.")

        return {
            "answer": " ".join(answer_parts),
            "products": top_products[:5],
            "source": "Product Database (RAG)",
            "confidence": "high" if hits[0]["score"] > 0.5 else "moderate"
        }

    elif context_type == "guidance":
        if not hits:
            return {"answer": "No specific guidance found. Please consult a certified AYUSH practitioner.", "source": "N/A"}
        top = hits[0]
        return {
            "answer": top["text"],
            "source": top["meta"].get("source", "AYUSH Guidelines"),
            "confidence": "high" if top["score"] > 0.6 else "moderate"
        }

    elif context_type == "review_summary":
        if not hits:
            return {"answer": "No reviews found for this product yet.", "summary": ""}

        sentiments = [h["meta"].get("sentiment", "neutral") for h in hits]
        ratings    = [float(h["meta"].get("rating", 3)) for h in hits]
        avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0
        positive   = sentiments.count("positive")
        total      = len(sentiments)
        pct        = round((positive / total) * 100) if total else 0

        excerpts = [h["text"][:80] for h in hits[:3]]
        return {
            "answer": f"{pct}% of {total} customers had a positive experience. Average rating: {avg_rating}/5.",
            "highlights": excerpts,
            "avg_rating": avg_rating,
            "positive_pct": pct,
            "total_reviews": total
        }

    return {"answer": "Query processed.", "source": "RAG Engine"}


# ════════════════════════════════════════════════════════════
# API Endpoints
# ════════════════════════════════════════════════════════════

# ── 1. Index product catalogue ────────────────────────────
@app.route("/rag/index/products", methods=["POST"])
def index_products():
    """
    Called by Node.js after fetching products from MongoDB.
    Body: { "products": [ {id, name, category, description, store, price, rating} ] }
    """
    data = request.get_json()
    products = data.get("products", [])
    if not products:
        return jsonify({"error": "No products provided"}), 400

    # Clear existing and re-index (fresh sync)
    try:
        chroma_client.delete_collection("ayush_products")
    except Exception:
        pass
    global products_col
    products_col = chroma_client.get_or_create_collection("ayush_products")

    docs, embeddings, ids, metas = [], [], [], []
    for prod in products:
        pid = str(prod.get("id", prod.get("_id", "")))
        if not pid:
            continue
        text = (
            f"{prod.get('name','')} - {prod.get('category','')} - "
            f"{prod.get('description','No description')} - Store: {prod.get('store','')}"
        )
        docs.append(text)
        embeddings.append(embed(text))
        ids.append(pid)
        metas.append({
            "id":          pid,
            "name":        prod.get("name", ""),
            "category":    prod.get("category", ""),
            "store":       prod.get("store", ""),
            "price":       str(prod.get("price", prod.get("priceValue", 0))),
            "rating":      str(prod.get("rating", "4.5")),
            "image":       prod.get("image", ""),
            "description": prod.get("description", "")[:200]
        })

    if docs:
        products_col.add(documents=docs, embeddings=embeddings, ids=ids, metadatas=metas)

    return jsonify({"indexed": len(docs), "message": "Product index updated successfully"})


# ── 2. Index reviews ──────────────────────────────────────
@app.route("/rag/index/reviews", methods=["POST"])
def index_reviews():
    """
    Body: { "product_id": "...", "reviews": [ {comment, rating, sentiment, date} ] }
    """
    data      = request.get_json()
    prod_id   = data.get("product_id", "")
    reviews   = data.get("reviews", [])
    if not reviews:
        return jsonify({"error": "No reviews"}), 400

    docs, embeddings, ids, metas = [], [], [], []
    for i, r in enumerate(reviews):
        comment = r.get("comment", "").strip()
        if not comment:
            continue
        rid = f"{prod_id}-review-{i}"
        docs.append(comment)
        embeddings.append(embed(comment))
        ids.append(rid)
        metas.append({
            "product_id": prod_id,
            "rating":     str(r.get("rating", 3)),
            "sentiment":  r.get("sentiment", "neutral"),
            "date":       r.get("date", "")
        })

    if docs:
        reviews_col.add(documents=docs, embeddings=embeddings, ids=ids, metadatas=metas)

    return jsonify({"indexed": len(docs)})


# ── 3. Index AYUSH guidance knowledge base ─────────────────
@app.route("/rag/index/guidance", methods=["POST"])
def index_guidance():
    """
    Body: { "documents": [ {title, content, source} ] }
    Accepts AYUSH ministry guidelines, product policy texts, etc.
    """
    data  = request.get_json()
    docs_ = data.get("documents", [])
    if not docs_:
        return jsonify({"error": "No documents provided"}), 400

    docs, embeddings, ids, metas = [], [], [], []
    for i, d in enumerate(docs_):
        content = d.get("content", "")
        if not content:
            continue
        # Chunk into ~300-char segments
        chunks = [content[j:j+300] for j in range(0, len(content), 250)]
        for k, chunk in enumerate(chunks):
            gid = f"guidance-{i}-{k}"
            docs.append(chunk)
            embeddings.append(embed(chunk))
            ids.append(gid)
            metas.append({"title": d.get("title", ""), "source": d.get("source", "")})

    if docs:
        guidance_col.add(documents=docs, embeddings=embeddings, ids=ids, metadatas=metas)

    return jsonify({"indexed": len(docs), "chunks": len(docs)})


# ── 4. Product Advisor Chat ────────────────────────────────
@app.route("/rag/chat", methods=["POST"])
def chat():
    """
    Main RAG chat endpoint.
    Body: { "query": "What helps with joint pain?" }
    """
    data  = request.get_json()
    query = data.get("query", "").strip()
    if not query:
        return jsonify({"error": "Query required"}), 400

    hits   = retrieve(products_col, query, n=6)
    answer = generate_answer(query, hits, context_type="product")
    return jsonify({**answer, "query": query, "timestamp": datetime.now().isoformat()})


# ── 5. Semantic Product Search ─────────────────────────────
@app.route("/rag/search", methods=["POST"])
def semantic_search():
    """
    Returns semantically ranked product results for a query.
    Body: { "query": "...", "n": 10 }
    """
    data  = request.get_json()
    query = data.get("query", "").strip()
    n     = data.get("n", 8)
    if not query:
        return jsonify({"error": "Query required"}), 400

    hits = retrieve(products_col, query, n=n)
    return jsonify({
        "results": [{"product": h["meta"], "relevance": h["score"]} for h in hits],
        "total": len(hits)
    })


# ── 6. Review Summary for a Product ───────────────────────
@app.route("/rag/reviews/summary", methods=["POST"])
def review_summary():
    """
    Retrieves and summarizes reviews for a given product.
    Body: { "product_id": "...", "query": "optional aspect e.g. 'quality'" }
    """
    data       = request.get_json()
    product_id = data.get("product_id", "")
    query      = data.get("query", "product experience quality")

    # Filter by product_id in metadata
    if reviews_col.count() == 0:
        return jsonify({"answer": "No reviews indexed yet.", "total_reviews": 0})

    results = reviews_col.query(
        query_embeddings=[embed(query)],
        n_results=min(10, reviews_col.count()),
        include=["documents", "metadatas", "distances"],
        where={"product_id": product_id} if product_id else None
    )
    hits = [
        {"text": doc, "meta": meta, "score": round(1 - dist, 3)}
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        )
    ]
    summary = generate_answer(query, hits, context_type="review_summary")
    return jsonify(summary)


# ── 7. AYUSH Guidance Query ────────────────────────────────
@app.route("/rag/guidance", methods=["POST"])
def guidance_query():
    """
    Answers questions from the AYUSH guidelines knowledge base.
    Body: { "query": "What is required for a Herbal product license?" }
    """
    data  = request.get_json()
    query = data.get("query", "").strip()
    if not query:
        return jsonify({"error": "Query required"}), 400

    hits   = retrieve(guidance_col, query, n=3)
    answer = generate_answer(query, hits, context_type="guidance")
    return jsonify({**answer, "query": query})


# ── 8. Status & Stats ──────────────────────────────────────
@app.route("/rag/status", methods=["GET"])
def status():
    return jsonify({
        "status": "online",
        "collections": {
            "products":  products_col.count(),
            "reviews":   reviews_col.count(),
            "guidance":  guidance_col.count()
        },
        "model":     "all-MiniLM-L6-v2",
        "vector_db": "ChromaDB (local)",
        "api_keys":  "None required"
    })


# ── 9. Clear all indexes ───────────────────────────────────
@app.route("/rag/clear", methods=["DELETE"])
def clear_indexes():
    global products_col, reviews_col, guidance_col
    for name in ["ayush_products", "ayush_reviews", "ayush_guidance"]:
        try:
            chroma_client.delete_collection(name)
        except Exception:
            pass
    products_col = chroma_client.get_or_create_collection("ayush_products")
    reviews_col  = chroma_client.get_or_create_collection("ayush_reviews")
    guidance_col = chroma_client.get_or_create_collection("ayush_guidance")
    return jsonify({"message": "All indexes cleared"})


# ── Run ────────────────────────────────────────────────────
if __name__ == "__main__":
    print("🌿 AYUSH RAG Service starting on http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=False)
