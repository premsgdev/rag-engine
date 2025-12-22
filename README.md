# 🧠 Local RAG Engine (NestJS)

A **deterministic, production-style Retrieval-Augmented Generation (RAG) backend** built with **NestJS**, **local embeddings**, **external vector storage**, **agentic validation**, and **streaming answers**.

---

## ✨ Key Capabilities

- ✅ Deterministic document ingestion (CLI-based)
- 🌍 Language-aware document handling (folder-based)
- 🧠 Local embeddings using **Xenova**
- 🗄 External vector storage using **ChromaDB**
- ⚡ Redis-based deduplication and chat state
- 🤖 Agentic query validation (LLM + evidence)
- 💬 Multi-turn chat with clarification handling
- 🌊 Streaming answers using **Gemini**
- 🧱 Clean, modular NestJS architecture

---

## 🧱 High-Level Architecture

PDF Files
↓
PDF Parser
↓
Text Splitter (sliding window)
↓
Local Embeddings (Xenova)
↓
Vector Store (ChromaDB)

### Chat flow:

User Query
↓
Vector Signal Check
↓
Agentic Validation (with snippets)
↓
Retrieval (top-K chunks)
↓
Context Assembly
↓
LLM Streaming Answer (Gemini)

### 📁 Project Structure

rag-engine/
├── data/
│ └── documents/
│ ├── en/
│ ├── ml/
│ └── de/
│
├── src/
│ ├── ai/ # Core AI infrastructure
│ ├── chat-llm/ # LLM adapters & prompts
│ ├── chat-agents/ # Agentic reasoning (validation)
│ ├── chat-retrieval/ # Vector retrieval + context assembly
│ ├── chat/ # Chat orchestration & state
│ ├── cli/ # CLI ingestion
│ ├── redis/ # Redis integration
│ └── app.module.ts
│
├── docker-compose.yml # ChromaDB + Redis
├── package.json
├── tsconfig.json
├── .env

## 🌍 Language Handling (Deterministic)

Documents are grouped by **folder name**, which is the **source of truth** for language.
  - data/documents/en/.pdf → English
  - data/documents/ml/.pdf → Malayalam
  - data/documents/de/*.pdf → German

Why this approach?

- ✔ No language detection cost
- ✔ No misclassification
- ✔ Deterministic behavior
- ✔ Easy to scale

---

## 🧩 Core Components (What Each Does)

### 1️⃣ EmbeddingsService
- Uses **Xenova/all-MiniLM-L6-v2**
- Runs locally (no cloud dependency)
- Model is loaded once and reused

---

### 2️⃣ ChromaService
- Thin client to external **ChromaDB**
- Handles:
  - Upserts
  - Similarity search
- Acts as an adapter (normalizes external data)

---

### 3️⃣ VectorSignalService
- Cheap probe to check:
  > “Does the corpus contain anything related to this query?”
- Prevents unnecessary LLM calls

---

### 4️⃣ QueryValidatorAgent
- LLM-based agent
- Validates queries using **retrieved snippets**
- Handles:
  - Ambiguity
  - Out-of-scope queries
  - Clarification requests

---

### 5️⃣ RetrieverService
- Performs real similarity search (top-K)
- No thresholds, no guessing
- Pure retrieval logic

---

### 6️⃣ ContextAssemblerService
- Builds a safe, bounded context
- Prevents token overflow
- Preserves document sources

---

### 7️⃣ AnswerGeneratorService
- Streams answers using **Gemini**
- No hallucination:
  - Answers ONLY from provided context
- Retry + backoff on transient failures

---

### 8️⃣ ChatService (Orchestrator)
Coordinates the full flow:
Signal Check
→ Validation
→ Clarification Handling
→ Retrieval
→ Context Assembly
→ Streaming Answer

---

## 🔁 Ingestion Workflow (CLI)

### Command

```bash
npx ts-node src/cli.ts ingest:documents
```
#### What happens
  1. Crawl language folders
  2. Parse PDFs
  3. Split text (sliding window)
  4. Hash chunks (SHA-256)
  5. Deduplicate using Redis 
  6. Embed new chunks (Xenova)
  7. Upsert to ChromaDB

## 💬 Chat Workflow (Multi-Turn)

#### Example

User: What is life?

System: Did you mean LIFE Mission (Livelihood Inclusion and Financial Empowerment Mission)?

(State stored in Redis)

User: yes

System:
  - Resolves clarification
  - Rewrites query internally
  - Retrieves context
  - Streams grounded answer

✔ No hallucination
✔ Natural chat experience
✔ Deterministic state handling

## 🧠 Design Principles

  - Determinism over guessing
  - Evidence before reasoning
  - Clarify before answering
  - State in backend, not in LLM
  - Adapters isolate external systems
  - Fail closed, never hallucinate


## 🚀 Getting Started
Prerequisites:
  - Docker
  - Node.js 18+
  - Docker & Docker Compose
  - Redis
  - ChromaDB
  
#### Environment Variables
```bash
GEMINI_API_KEY=your_api_key
CHROMA_HOST=http://localhost:8000
```

#### Start infrastructure
```bash
docker compose up -d
```

#### Run ingestion
```bash
npx ts-node src/cli.ts ingest:documents
```

#### Start API (dev)
```bash
npm run start:dev
```