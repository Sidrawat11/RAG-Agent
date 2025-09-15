# RAG‑Agent — Retrieval‑Augmented Generation Chat System

> A practical, end‑to‑end RAG stack I designed and implemented to ingest technical PDFs, build an embedding index, and answer questions with sourced citations. This README doubles as a case‑study so recruiters/teammates can quickly see *what I built*, *how it works*, and *why the engineering choices matter*.

---

## 💼 Executive Summary (what this project proves)

* **Problem:** Long, dense PDFs are hard to search; answers are slow and often hallucinated.
* **Solution:** A **Python backend** that ingests PDFs → chunks → embeds → stores vectors → retrieves top‑k → composes a grounded answer with **citations**; a **web frontend** for upload + chat.
* **Result:** A self‑hostable RAG workflow with clean separation of concerns, secret‑safe config, and a path to productionization (Docker/CI later).
* **My Role:** Full‑stack design & build (pipeline, APIs, retrieval logic, UI, security hygiene, docs).

> ⚠️ No secrets are committed; `.env` is ignored. The repo history was scrubbed to remove an early test token (see *Security* section).

---

## 🧱 Repo Structure

```
RAG-Agent/
├─ Backend/                      # Python backend (APIs + RAG pipeline)
│  ├─ main.py                    # Entrypoint (script or ASGI app)
│  ├─ requirements.txt           # Python deps
│  └─ ...
├─ frontend/                     # Web app (created with npx)
│  └─ ...
├─ docs/                         # Sample PDFs / knowledge base
├─ README.md
├─ package.json                  # If your frontend lives at repo root too
└─ .gitignore                    # keeps .env & junk out of Git
```

---

## 🧰 Tech Stack

**Backend:** Python 3.12, embeddings via Hugging Face/OpenAI (pluggable), vector store (FAISS/Chroma/PGVector—pick one), simple REST API (FastAPI/Flask style).
**Frontend:** JavaScript/TypeScript app (Vite/React/Next—app lives in `frontend/` or at repo root).
**Tooling:** GitHub Push Protection, `.env` for secrets, optional Docker/Make.

> Swap placeholders with the exact libs you used (e.g., `sentence-transformers`, `chromadb`, `fastapi`).

---

## ✨ Features

* **Document ingestion** of PDFs in `docs/` (or user upload)
* **Chunking** with configurable size/overlap
* **Embeddings** via HF or OpenAI (selectable)
* **Semantic retrieval** (cosine similarity, top‑k)
* **Grounded generation** with **inline citations** (file + page)
* **Local‑first dev**; drop‑in keys via `.env`

---

## 🏗 Architecture & Data Flow

```
User → Frontend (upload/query) → Backend API
Backend: Ingest → Chunk → Embed → Vector Store
Query: Embed question → Retrieve top‑k → Compose answer → Cite sources → Return
```

**Why this design:**

* Keeps retrieval deterministic and debuggable (log candidates + scores).
* Frontend is provider‑agnostic; backend abstracts models/stores.
* Easy to swap embedding model or vector DB without changing UI.

---

## 🚀 Quickstart

### 1) Clone

```bash
git clone https://github.com/<you>/RAG-Agent.git
cd RAG-Agent
```

### 2) Environment

Create a local `.env` (never commit):

```dotenv
# Provider keys (use only what you need)
HF_TOKEN=
OPENAI_API_KEY=

# App config
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
VECTOR_STORE_PATH=.rag/index
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
BACKEND_PORT=8000
FRONTEND_PORT=5173
```

### 3) Backend

```bash
python -m venv .venv
# PowerShell
. .venv/Scripts/Activate.ps1
# macOS/Linux: source .venv/bin/activate

pip install -r Backend/requirements.txt
# run the server (update if using FastAPI/uvicorn)
python Backend/main.py
# or: uvicorn Backend.main:app --reload --port 8000
```

### 4) Frontend

**If the app lives in `frontend/`:**

```bash
cd frontend
npm i
npm run dev
```

**If the app lives at repo root:**

```bash
npm i
npm run dev
```

Open the printed dev URL (e.g., `http://localhost:5173`).

---

## 🔌 API (document your real routes)

> Replace placeholders below with the exact endpoints in `Backend/main.py`.

**POST** `/api/ingest` – index local files

```json
{ "paths": ["docs/IntelQAT Virtualization AppNote.pdf"], "overwrite": true }
```

**POST** `/api/query` – ask a question

```json
{ "query": "What are the VMware driver requirements?", "top_k": 5 }
```

**Response**

```json
{
  "answer": "... grounded summary ...",
  "citations": [
    {"file": "docs/RN-VMWARE.pdf", "page": 3, "text": "... excerpt ..."}
  ]
}
```

---

## 📈 Benchmarks (replace with your numbers)

* **Indexing:** N docs / M pages in ***X.XX s*** on laptop CPU.
* **Query latency:** p50 ***XXX ms***, p95 ***XXX ms*** (top‑k=5).
* **Hit quality:** ≥ ***YY%*** top‑1 contains the answer span (manual eval of 50 queries).

> Include the simple scripts you used to measure. Numbers talk.

---

## 🔒 Security & Governance

* **No secrets in Git**: `.env` is ignored; Push Protection enabled.
* **Incident:** An early local commit accidentally included `.env`. Before any remote push, history was **rewritten** to remove it (git‑filter‑repo). Token was **rotated**.
* **Hardening ideas:** add pre‑commit hooks (secretlint), scoped API keys, CI that lints for token patterns.

---

## 🧪 Testing

* **Unit tests** for chunking/retrieval scoring.
* **Contract tests** for `/api/query` (known doc → expected phrase).
* **Frontend**: smoke test that renders answer + citations.

---

## 🗓 Roadmap

* [ ] Docker Compose (backend + frontend + vector DB)
* [ ] Citation highlighting in UI
* [ ] Streaming tokens in chat view
* [ ] Ingest CLI (`python Backend/ingest.py --path docs/`)
* [ ] PGVector/SQLite toggle
* [ ] Basic CI (lint, test)

---

## 🙋 My Role & Key Contributions (use on résumé)

* **Designed & built** an end‑to‑end RAG system (Python + JS) with clean ingestion, retrieval, and chat layers.
* **Implemented** document chunking & embedding pipeline with swappable models (HF/OpenAI), enabling rapid experimentation.
* **Engineered** top‑k semantic retrieval with citation‑aware answer composition to reduce hallucinations.
* **Developed** a minimal web UI for uploading docs and asking questions with source attributions.
* **Hardened** the project for real‑world use: `.env` hygiene, GitHub Push Protection, secret rotation, and history rewrite when needed.
* **Documented** architecture, runbooks, and future work; produced this case‑study README.

### Resume‑ready bullet samples (customize numbers)

* Built a full‑stack **Retrieval‑Augmented Generation** system (Python + React) that ingests technical PDFs and answers questions with **cited sources**, cutting manual search time by **\~X%**.
* Implemented a pluggable **embedding pipeline** (HF/OpenAI) and **vector store** backend (FAISS/Chroma), enabling model swaps in **\<N mins** with zero UI changes.
* Reduced average query latency to **p50 \~XXX ms** via chunk‑size tuning and top‑k retrieval optimizations; added request‑level logging for observability.
* Instituted repo **secret hygiene** (`.env`, push protection, token rotation) and wrote automation notes for history scrubbing.

---

## 📝 How to Talk About This Project

* Focus on **grounding** and **citations** as the practical mitigation for LLM hallucinations.
* Call out **abstractions** (embedding + store adapters) as an engineering decision that made the project evolvable.
* If you add Docker/CI, mention **deployability** and **repeatability**.

---

## 📄 License

Add your license file (MIT/Apache‑2.0 recommended for open‑source).

---

## 🙏 Acknowledgments

Thanks to the open‑source RAG ecosystem (embeddings, vector stores, and web tooling). Replace this line with specific packages once finalized.
