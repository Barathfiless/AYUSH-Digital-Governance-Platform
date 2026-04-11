# 🌿 AYUSH Gateway – RAG System

## Overview
A **100% offline, zero-API-key** Retrieval-Augmented Generation system built on top of the AYUSH Gateway to add intelligent product discovery, guidance Q&A, and review summarization.

| Component | Technology | Purpose |
|---|---|---|
| **Embedding Model** | `all-MiniLM-L6-v2` (sentence-transformers) | Convert text to vectors locally |
| **Vector Database** | ChromaDB (persistent, local) | Store and retrieve semantic embeddings |
| **LLM / Generation** | Template-based answer builder | Construct answers from retrieved context |
| **Web Service** | Flask (Python) | Expose RAG API on `localhost:5001` |
| **Bridge** | Node.js Express route (`/api/rag`) | Frontend → Node → Python |
| **UI** | React chatbot widget | Floating AI advisor panel |

---

## 🚀 Quick Start

### Step 1 – Start the RAG Service
```bash
cd Server/rag
start_rag.bat           # Windows
# OR
python rag_service.py   # Direct
```

### Step 2 – Seed the Knowledge Base
```bash
python seed_guidance.py
```

### Step 3 – Sync Products from MongoDB
```
POST /api/rag/sync/products
```
Call this once from your admin panel or on server start.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET`  | `/api/rag/status` | Health check & collection stats |
| `POST` | `/api/rag/chat` | Product advisor chat |
| `POST` | `/api/rag/search` | Semantic product search |
| `POST` | `/api/rag/reviews/summary` | Summarize reviews for a product |
| `POST` | `/api/rag/guidance` | Query AYUSH guidelines |
| `POST` | `/api/rag/sync/products` | Re-index all products from MongoDB |
| `POST` | `/api/rag/index/reviews` | Index reviews for a product |

---

## 🎯 Features Powered by RAG

1. **💬 AI Product Advisor** – Conversational interface to find the right AYUSH products for any health goal.  
2. **🔍 Semantic Search** – Understands *meaning*, not just keywords. "something for stress" finds Ashwagandha.  
3. **⭐ Review Intelligence** – Auto-summarizes customer reviews with AI-extracted sentiment highlights.  
4. **📋 Guidance Q&A** – Answers licensing and regulation questions from AYUSH ministry content.

---

## 🗂️ File Structure

```
Server/rag/
├── rag_service.py     ← Core RAG API (Flask)
├── seed_guidance.py   ← Seeds AYUSH knowledge base
├── start_rag.bat      ← One-click launcher (Windows)
├── requirements.txt   ← Python dependencies
├── chroma_db/         ← Auto-created; persistent vector store
└── RAG_README.md      ← This file

Server/routes/rag.js   ← Node.js bridge to Python service
Client/src/components/rag/AyushAdvisor.tsx ← Chatbot UI
```
