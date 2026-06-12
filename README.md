<div align="center">
  <h1>Nexus AI – Open Source AI Chat Platform</h1>
  <p>
    <strong>Nexus AI is an open-source AI chat platform built with Next.js, TypeScript, and modern AI APIs. It supports multiple LLM providers including OpenAI, Claude, Gemini, and NVIDIA APIs with streaming responses, markdown rendering, and a beautiful ChatGPT-like interface.</strong>
  </p>
  <p>
    <a href="https://nexus-ai-one-tawny.vercel.app">Live Demo</a> •
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

---

## 🚀 Live Preview
Experience the **Next.js AI Chat App** live:
🔗 **[Nexus AI Live Demo](https://nexus-ai-one-tawny.vercel.app)**

![Nexus AI Chat Interface built with Next.js](public/screenshot.png) *(Note: Add actual screenshot to public/screenshot.png)*

---

## ✨ Features

Nexus AI serves as a powerful **Generative AI Platform** and **AI Workspace**. Here are the core capabilities:
- **AI Chat**: Engage in seamless conversations with top-tier language models.
- **Multi-Model Support**: Easily switch between OpenAI, Claude, Gemini, and NVIDIA API integrations.
- **Streaming Responses**: Enjoy real-time, streaming AI responses for a fluid chat experience.
- **Markdown Rendering & Code Highlighting**: Beautifully formatted responses with syntax highlighting for developers.
- **Authentication**: Secure user login and session management.
- **Responsive Web UI**: A sleek, fully responsive AI Web UI designed for desktop and mobile.
- **File Upload**: (Coming Soon) Support for document analysis and RAG Chat Application capabilities.

---

## 🛠 Tech Stack

Our **Self Hosted ChatGPT** alternative is built with a modern and scalable tech stack:
- **Framework**: Next.js 15 (App Router)
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion
- **Database**: PostgreSQL, Prisma ORM
- **State Management**: Zustand, React Query
- **AI Integrations**: Vercel AI SDK, OpenAI API, NVIDIA API

---

## 📸 Screenshots
*(Add screenshots here to showcase your LLM Chat Interface)*
- **Chat View**: `![AI Chat Application Interface](public/chat-view.png)`
- **Model Selection**: `![Multi Model AI Platform Selection](public/model-selection.png)`
- **Mobile View**: `![Mobile AI Assistant](public/mobile-view.png)`

---

## ⚙️ Installation

To set up your own **Open Source AI Chat** environment locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Nexus-AI.git
   cd Nexus-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 🔐 Environment Variables (.env)

Create a `.env` file in the root directory and configure the following variables. This setup is crucial for your **OpenAI Compatible API** and database connections.

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nexus_db"

# NextAuth / Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# AI Provider APIs
OPENAI_API_KEY="your_openai_api_key"
NVIDIA_API_KEY="your_nvidia_api_key"
GEMINI_API_KEY="your_gemini_api_key"
ANTHROPIC_API_KEY="your_anthropic_api_key"
```

---

## 🚀 Running Locally

Start the development server for your **AI Playground**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the **Chat Interface**.

---

## 🐳 Docker Setup (Optional)
Deploying your **AI Agent Platform** via Docker:
```bash
docker build -t nexus-ai .
docker run -p 3000:3000 --env-file .env nexus-ai
```

---

## 🌍 Deployment Guide

**Vercel Deployment:**
The easiest way to deploy this **Next.js AI Chat App** is using Vercel.
1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Add the necessary Environment Variables.
4. Deploy!

**Self-Hosted:**
You can easily self-host this **ChatGPT Clone** on your own VPS using Docker or PM2.

---

## 📁 Project Structure

```
nexus-ai/
├── prisma/             # Database schema
├── src/
│   ├── app/            # Next.js App Router pages and API routes
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utilities and configurations
│   ├── store/          # Zustand state management
│   └── types/          # TypeScript definitions
├── public/             # Static assets
└── tailwind.config.ts  # Tailwind CSS configuration
```

---

## 🤖 Supported AI Models

Nexus AI is a true **Multi Model AI Platform**, supporting:
- **OpenAI**: GPT-4o, GPT-4 Turbo, GPT-3.5
- **Anthropic**: Claude 3 Opus, Sonnet, Haiku
- **Google**: Gemini 1.5 Pro, Gemini 1.5 Flash
- **NVIDIA**: Nemotron, Mixtral, and more

---

## 💡 Use Cases

- **AI Playground**: Test different prompts across various models simultaneously.
- **Self Hosted ChatGPT**: Run a private, secure AI chat instance for your organization.
- **RAG Chat Application**: Extend the platform to query internal documents securely.
- **Coding Assistant**: Utilize code highlighting and markdown for software development.

---

## ⚡ Performance Optimizations
- Edge Runtime for API routes to minimize latency.
- Streaming UI updates for immediate feedback.
- Optimized database queries using Prisma.

---

## 🛡 Security Features
- Secure NextAuth session handling.
- Environment variable protection for API keys.
- Input sanitization and rate limiting on API endpoints.

---

## 🗺 Roadmap
- [x] Basic Chat Interface
- [x] Multi-Model Support
- [x] Streaming AI Responses
- [x] Database Integration (Prisma + PostgreSQL)
- [ ] File Upload & Document parsing (RAG)
- [ ] Voice Input & Output
- [ ] Image Generation Support
- [ ] Plugin System

---

## 🤝 Contributing Guide
We welcome contributions to make Nexus AI the best **Open Source AI Chat** platform!
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ❓ FAQ

**Q: Can I use this for commercial purposes?**
A: Yes, Nexus AI is open-source under the MIT license.

**Q: How do I add a new AI provider?**
A: You can extend the provider abstraction layer in `src/services/providers` and add the respective API keys.

---

## 🙏 Acknowledgements
- [Next.js](https://nextjs.org/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)

---

## ⭐ Star History
[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/Nexus-AI&type=Date)](https://star-history.com/#yourusername/Nexus-AI&Date)

*(Don't forget to update the GitHub URL in the Star History link!)*

---

## 🔍 Keywords
AI Chat Application, Open Source AI Chat, ChatGPT Clone, AI Assistant, Multi Model AI Platform, LLM Chat Interface, OpenAI Compatible API, AI Playground, Generative AI Platform, Next.js AI Chat App, Self Hosted ChatGPT, AI Workspace, AI Web UI, RAG Chat Application, AI Agent Platform, Chat Interface, Streaming AI Responses, OpenAI API Integration, Claude Integration, Gemini Integration, NVIDIA API Integration.
