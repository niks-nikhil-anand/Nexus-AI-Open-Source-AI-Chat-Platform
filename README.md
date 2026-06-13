<div align="center">
  <img src="public/logo2.png" alt="Nexus AI - Open Source AI Chat Platform" width="120" />
  
  <h1>Nexus AI – Open Source AI Chat Platform & ChatGPT Clone</h1>
  
  <p>
    <a href="https://github.com/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform/stargazers"><img src="https://img.shields.io/github/stars/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform?style=for-the-badge&color=yellow" alt="Stars"></a>
    <a href="https://github.com/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform/network/members"><img src="https://img.shields.io/github/forks/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform?style=for-the-badge&color=blue" alt="Forks"></a>
    <a href="https://github.com/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform/issues"><img src="https://img.shields.io/github/issues/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform?style=for-the-badge&color=red" alt="Issues"></a>
    <a href="https://github.com/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform/blob/main/LICENSE"><img src="https://img.shields.io/github/license/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform?style=for-the-badge&color=green" alt="License"></a>
    <img src="https://img.shields.io/github/last-commit/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform?style=for-the-badge&color=purple" alt="Last Commit">
  </p>

  <p>
    <strong>Nexus AI is a self-hosted ChatGPT alternative and open-source AI chat platform built with Next.js 15. It serves as a multi-model generative AI platform supporting OpenAI, Claude, Gemini, and NVIDIA APIs.</strong>
  </p>

  <p>
    <a href="https://nexus-ai-one-tawny.vercel.app"><strong>Live Demo</strong></a> ·
    <a href="#-quick-start-one-command-setup"><strong>Quick Start</strong></a> ·
    <a href="#-why-nexus-ai"><strong>Why Nexus AI?</strong></a> ·
    <a href="#-features"><strong>Features</strong></a>
  </p>
</div>

---

> **⭐️ Support the Project:** If you find Nexus AI useful, please consider giving it a star! It helps visibility and motivates us to release the upcoming RAG and Voice features faster.

---

## 📸 See it in Action

*(Add your high-quality GIFs or screenshots here!)*

`![Nexus AI Chat Interface](public/demo-streaming.gif)`
<br/>
`![Model Switching and Markdown](public/demo-model-switch.gif)`

---

## ✨ Core Features

Nexus AI is packed with features that make it the ultimate **Generative AI Platform** and **LLM Chat Interface**.

- **Multi-Model AI Playground:** Instantly switch between OpenAI (GPT-4o), Anthropic (Claude 3.5 Sonnet), Google (Gemini 1.5 Pro), and NVIDIA enterprise models.
- **Real-Time Streaming AI Responses:** Fast, native-feeling text generation directly to your UI.
- **Self Hosted AI Assistant:** Full control over your data privacy and API keys. No vendor lock-in.
- **Beautiful Modern UI:** Built with Tailwind CSS and Framer Motion for a premium, ChatGPT-like experience.
- **Developer Ready:** Markdown rendering, code highlighting with copy-to-clipboard, and extensible API routes.
- **Secure Authentication:** Built-in session management using NextAuth.

---

## 🤖 Available AI Models & Details

| Model Name | Provider | Context | Description & Strengths |
| :--- | :--- | :--- | :--- |
| **DeepSeek V4 Flash** | DeepSeek | 1M | A highly efficient 284B MoE model built for fast coding and agentic workflows. (Strengths: Coding, Speed, Agentic Workflows) |
| **DeepSeek V4 Pro** | DeepSeek | 1M | 1.6T MoE optimized for complex software engineering and multi-step tasks. (Strengths: Complex Coding, Large Context, MoE) |
| **Mistral Small 4 119B** | Mistral | 256K | A hybrid MoE model unifying instruction-following, reasoning, and coding. (Strengths: Multimodal, Reasoning, Coding) |
| **Ministral 14B Instruct** | Mistral | 262K | An edge-optimized multimodal Small Language Model (SLM). (Strengths: Vision, Edge Deployment, Efficiency) |
| **Mixtral 8x7B Instruct** | Mistral | 32K | Landmark sparse MoE model offering high efficiency for general text generation. (Strengths: MoE Architecture, Text Generation) |
| **Nemotron-3 Super 120B** | NVIDIA | 131K | A 120B MoE hybrid balancing speed and intelligence for tool calling and planning. (Strengths: Tool Calling, Planning) |
| **Nemotron-3 Ultra 550B** | NVIDIA | 1M | Massive 550B model optimized for frontier agentic reasoning and advanced coding. (Strengths: Reasoning, Agentic Workflows) |
| **Gemma 4 31B IT** | Google | 131K | A highly dense model delivering frontier-level reasoning relative to its compact size. (Strengths: Reasoning, Speed, Efficiency) |
| **Qwen 3.5 122B** | Alibaba | 262K | A native multimodal MoE agent model processing text, images, and video. (Strengths: Visual Understanding, Tool Use) |
| **MiniMax M2.7** | MiniMax | 128K | Designed for autonomous software engineering with recursive self-optimization. (Strengths: Agentic LLM, Self-Optimizing) |
| **Phi-4 Mini Instruct** | Microsoft | 128K | A lightweight SLM relying on synthetic data for logic, math, and coding. (Strengths: Local Execution, Logic & Math) |
| **Llama 3.3 70B Instruct** | Meta | 128K | Popular open frontier model with state-of-the-art multilingual and conversational abilities. (Strengths: Conversational, Enterprise) |
| **Step-3.7 Flash** | StepFun | 128K | High-speed, high-concurrency model tailored for real-time customer service. (Strengths: High Throughput, Low Latency) |
| **Kimi K2.6** | Moonshot | 262K | Specializes in high-speed synthesis of lengthy documents and agile chat. (Strengths: Long Context, Fast Retrieval) |
| **GPT-OSS 20B** | OpenAI | 131K | A lightweight, developer-friendly edge model for open-source ecosystems. (Strengths: Open Source, Edge Execution) |
| **GPT-OSS 120B** | OpenAI | 131K | Larger open-source offering to tackle massive reasoning without closed API lock-in. (Strengths: Domain Knowledge, Complex Reasoning) |
| **Seed-OSS 36B Instruct** | ByteDance | 128K | Agentic intelligence model with native thinking budget capabilities. (Strengths: Agentic Intelligence, Thinking Budget) |

*(Note: These model descriptions, metadata, and scores are defined locally in your codebase under `lib/ai-models.ts`)*

---

## 🔌 API Architecture: How Nexus AI uses the NVIDIA API

Nexus AI uses a highly efficient architectural trick to achieve multi-model support: **It uses the NVIDIA API as a unified model gateway.** 

Here is exactly how it works under the hood (in `app/api/chat/route.ts`):

1. **Local Model Metadata:** The list of models, their stats, and their UI colors are completely hardcoded in `lib/ai-models.ts`—it doesn't waste time fetching the catalogue from NVIDIA on every load.
2. **Unified NVIDIA Inference Microservices (NIM):** Instead of writing custom API integration code for OpenAI, Google, Anthropic, and Mistral separately (which would require 4 different API keys and 4 different SDK setups), Nexus AI forwards **all** chat requests to a single endpoint: `https://integrate.api.nvidia.com/v1/chat/completions`.
3. **Model Mapping / Aliasing:** Because NVIDIA hosts many open-weight and frontier models (like Llama, Gemma, Mistral, and DeepSeek) on their own cloud infrastructure, Nexus AI uses a `MODEL_ALIASES` dictionary to translate the user's selected UI model into the exact model string the NVIDIA API expects. For example, if a user clicks `gemini-2-5-pro` on the frontend, the backend maps it to `google/gemma-4-31b-it` and sends it to NVIDIA.
4. **Single API Key Execution:** The app attaches a single `NVIDIA_API_KEY` as a Bearer token. NVIDIA executes the inference on their GPUs and streams the chunks back to the Next.js API route using the standard OpenAI-compatible SSE (Server-Sent Events) format.

This allows the application to provide a massive catalogue of models without the headache of managing multiple provider SDKs or API keys!

---

## ⚖️ Alternative Comparison Table

Searching for the best **ChatGPT Alternative**? See how Nexus AI compares:

| Feature | Nexus AI | ChatGPT (Free/Plus) | LibreChat | Open-WebUI |
|---------|:---:|:---:|:---:|:---:|
| **Multi-model Support** | ✅ (Multiple APIs) | ❌ (OpenAI only) | ✅ | ✅ |
| **Self-hosted & Private** | ✅ | ❌ | ✅ | ✅ |
| **Open Source** | ✅ | ❌ | ✅ | ✅ |
| **Next.js 15 App Router** | ✅ | ❌ | ❌ | ❌ |
| **Premium Framer Motion UI** | ✅ | ❌ | ❌ | ❌ |

---

## 💼 Use Cases

**Private Corporate AI Workspace**  
Deploy Nexus AI within your company’s internal network to provide employees with access to cutting-edge LLMs without exposing sensitive company data to public AI services. Protect your API keys centrally.

**Developer AI Playground**  
Test out different system prompts and compare the output quality of Claude vs. GPT-4o vs. Gemini simultaneously. Ideal for prompt engineering and model evaluation.

**Self Hosted ChatGPT Alternative for Personal Use**  
Run your own AI chat interface locally or on a cheap VPS. Pay only for the API tokens you use instead of an expensive monthly subscription.

---

## 🏗️ Architecture Overview

Nexus AI utilizes a clean, modern, and highly scalable architecture.

```mermaid
graph TD
    User([User]) -->|Interacts| UI[Next.js App Router UI]
    UI -->|API Requests| API[Next.js API Route Layer]
    
    API -->|Vercel AI SDK| ProviderAbstraction[Provider Abstraction Layer]
    
    ProviderAbstraction --> OpenAI[OpenAI API]
    ProviderAbstraction --> Claude[Anthropic API]
    ProviderAbstraction --> Gemini[Google Gemini API]
    ProviderAbstraction --> NVIDIA[NVIDIA AI API]
    ProviderAbstraction --> Local[Local LLMs / Ollama]
    
    API <--> DB[(PostgreSQL + Prisma)]
```

---

## 🛠️ Tech Stack & Installation

- **Frontend:** React, Next.js 15, TypeScript, Tailwind CSS, Shadcn UI
- **Backend/API:** Next.js Server Actions, Vercel AI SDK
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js

### ⚡ Quick Start: One Command Setup

```bash
git clone https://github.com/niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform.git
cd Nexus-AI-Open-Source-AI-Chat-Platform
npm install
cp .env.example .env
npm run dev
```
*Your instance will be running at [http://localhost:3000](http://localhost:3000).*

### Environment Configuration
Make sure your `.env` contains:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nexus_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_key"
OPENAI_API_KEY="your_api_key"
# Add other keys as needed...
```

---

## 🗺️ Roadmap & Future Plans

- [x] Multi-provider integration (OpenAI, Anthropic, Google, NVIDIA)
- [x] Streaming chat UI with markdown rendering
- [x] Database persistence with Prisma
- [ ] **File Upload & Document parsing (RAG Chat Application)** 
- [ ] **Voice Input & Output**
- [ ] Vision Capabilities (Image input)
- [ ] Custom plugin ecosystem

---

## 🤝 Contributing

We welcome contributions! Please see our contribution files:
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)

---

## ⭐ Star History

Watch our **Open Source AI Chat** community grow!

[![Star History Chart](https://api.star-history.com/svg?repos=niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform&type=Date)](https://star-history.com/#niks-nikhil-anand/Nexus-AI-Open-Source-AI-Chat-Platform&Date)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔍 GitHub Topics & SEO Keywords
<details>
<summary>View Keywords & Topics</summary>

**Topics:** `chatgpt-clone`, `nextjs`, `vercel-ai-sdk`, `self-hosted`, `llm-ui`, `openai`, `claude-3`, `gemini`, `ai`, `chatbot`, `llm`, `generative-ai`, `open-source`, `developer-tools`

**Keywords:** Open Source AI Chat Platform, ChatGPT Alternative, Multi-Model AI Playground, Self Hosted AI Assistant, Next.js AI Chat Application, OpenAI Compatible API, AI Workspace, LLM Chat Interface, RAG Chat Application, Chat Interface, Streaming AI Responses, Generative AI Platform.
</details>
