# RAG‑Agent

> Retrieval‑Augmented Generation chat system. Ingest technical PDFs, index them, and ask grounded questions with citations. Built as a compact, resume‑ready showcase of full‑stack RAG.

---

## Highlights

* **PDF ingestion → chunking → embeddings → vector search** (top‑k)
* **Grounded answers with citations** (file + page)
* **Python backend** (simple REST) + **JS/TS frontend** (Vite/React‑style)
* **Pluggable providers** (Hugging Face / OpenAI) and vector store
* **Local‑first dev** with `.env` (secrets are ignored by Git)

---

## Tech Stack

* **Backend:** Python 3.12, REST API (FastAPI/Flask‑style), embeddings (HF/OpenAI), vector store (FAISS/Chroma/PGVector)
* **Frontend:** JS/TS app (in `/frontend`)
* **Tooling:** GitHub Push Protection, `.env`

> Swap the placeholders above with the exact libs you’re using.

---

## Project Layout

```
RAG-Agent/
├─ Backend/                  # Python backend (APIs + pipeline)
│  ├─ main.py                # Entrypoint
│  └─ requirements.txt
├─ frontend/                 # Web app
├─ docs/                     # Sample PDFs
└─ .gitignore
```

---

## Quickstart

### 1) Clone

```bash
git clone https://github.com/<you>/RAG-Agent.git
cd RAG-Agent
```

### 2) Backend

```bash
python -m venv .venv
# PowerShell:
. .venv/Scripts/Activate.ps1
# macOS/Linux: source .venv/bin/activate

pip install -r Backend/requirements.txt
# run the server (adjust if using FastAPI/uvicorn)
python Backend/main.py
# e.g. uvicorn Backend.main:app --reload --port 8000
```

### 3) Frontend

```bash
cd frontend
npm i
npm run dev
# open the printed URL (e.g., http://localhost:5173)
```

---

## Configuration

Create a **.env** in the repo root (do not commit it):

```dotenv
# Provider keys (use what you need)
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

---

## Basic Usage

1. Put PDFs in `docs/` (or upload via UI).
2. Start backend + frontend.
3. Ask a question in the UI; answers include citations.

*If you expose APIs, document them briefly here (e.g., `/api/ingest`, `/api/query`).*

---

## What I Built (for recruiters)

* Designed and implemented a minimal **RAG pipeline** (ingest → embed → retrieve → cite) with a clean REST API and a lightweight web UI.
* Abstracted **embeddings** and **vector store** so providers can be swapped without UI changes.
* Added **citation‑aware answers** to reduce hallucinations and speed up doc lookup.

(Replace with concrete numbers if you have them—e.g., p50 latency, index size.)

---

## License

This project is licensed under the **MIT License**.
