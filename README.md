<div align="center">
  <img src="public/logo.png" alt="Nexus AI - Open Source AI Chat Platform" width="120" />
  
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
