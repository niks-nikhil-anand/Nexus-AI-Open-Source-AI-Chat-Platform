# 🚀 NeuraChat — Premium Multi-Model AI Chat Platform

> A production-grade ChatGPT/Claude-style AI platform built with Next.js 15, supporting multiple AI providers with a premium, animated UI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Phase-by-Phase Implementation Plan](#phase-by-phase-implementation-plan)
  - [Phase 1 — Project Scaffolding](#phase-1--project-scaffolding)
  - [Phase 2 — Type Definitions](#phase-2--type-definitions)
  - [Phase 3 — Provider Abstraction Layer](#phase-3--provider-abstraction-layer)
  - [Phase 4 — Zustand Store](#phase-4--zustand-store)
  - [Phase 5 — API Routes & Server Actions](#phase-5--api-routes--server-actions)
  - [Phase 6 — Layout Components](#phase-6--layout-components)
  - [Phase 7 — Chat Components](#phase-7--chat-components)
  - [Phase 8 — Model Components](#phase-8--model-components)
  - [Phase 9 — Framer Motion Animations](#phase-9--framer-motion-animations)
  - [Phase 10 — Theme System](#phase-10--theme-system)
  - [Phase 11 — Hooks & Utilities](#phase-11--hooks--utilities)
  - [Phase 12 — Performance & Polish](#phase-12--performance--polish)
- [Environment Variables](#environment-variables)
- [Supported Models](#supported-models)
- [Running Locally](#running-locally)

---

## Overview

NeuraChat is a **premium multi-model AI chat platform** that aggregates top AI providers (OpenAI, NVIDIA, Mistral, DeepSeek, Qwen, Google) under a single beautiful interface. Built with Next.js 15 App Router, it features streaming responses, a three-column desktop layout, animated model cards, and a provider abstraction layer for easy extensibility.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn/UI |
| Animations | Framer Motion |
| State | Zustand |
| Server State | TanStack Query (React Query) |
| AI Layer | Vercel AI SDK |
| Icons | Lucide React |
| Theme | next-themes |

---

## Project Structure

```
neurachat/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Landing / redirect to /chat
│   │   ├── chat/
│   │   │   ├── page.tsx             # New chat page
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Existing conversation page
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts         # Streaming API endpoint
│   │
│   ├── actions/
│   │   ├── chat.actions.ts          # Server actions for chat CRUD
│   │   └── conversation.actions.ts  # Conversation management
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── UserMessage.tsx
│   │   │   ├── AssistantMessage.tsx
│   │   │   ├── StreamingMessage.tsx
│   │   │   ├── MessageToolbar.tsx
│   │   │   ├── MessageActions.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── LeftSidebar.tsx
│   │   │   ├── RightSidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── CommandPalette.tsx
│   │   │   └── AppShell.tsx
│   │   │
│   │   ├── models/
│   │   │   ├── ModelSelector.tsx
│   │   │   ├── ModelCard.tsx
│   │   │   ├── ProviderBadge.tsx
│   │   │   └── ContextBadge.tsx
│   │   │
│   │   └── ui/
│   │       ├── ThemeSwitcher.tsx
│   │       ├── SearchDialog.tsx
│   │       ├── LoadingSkeleton.tsx
│   │       ├── AnimatedText.tsx
│   │       └── GlassCard.tsx
│   │
│   ├── hooks/
│   │   ├── useChat.ts
│   │   ├── useStreaming.ts
│   │   ├── useConversations.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useAutoScroll.ts
│   │
│   ├── store/
│   │   ├── chatStore.ts             # Active chat state
│   │   ├── uiStore.ts               # Sidebar, theme, panel state
│   │   └── modelStore.ts            # Selected model/provider
│   │
│   ├── services/
│   │   ├── ai/
│   │   │   └── streamingService.ts
│   │   └── providers/
│   │       ├── index.ts             # Provider registry
│   │       ├── base.provider.ts     # Abstract base class
│   │       ├── openai.provider.ts
│   │       ├── nvidia.provider.ts
│   │       ├── mistral.provider.ts
│   │       ├── deepseek.provider.ts
│   │       ├── qwen.provider.ts
│   │       └── google.provider.ts
│   │
│   ├── lib/
│   │   ├── utils.ts                 # cn(), formatters
│   │   ├── markdown.ts              # Remark/rehype config
│   │   └── db.ts                    # Local storage / DB abstraction
│   │
│   ├── types/
│   │   ├── chat.types.ts
│   │   ├── model.types.ts
│   │   ├── provider.types.ts
│   │   └── ui.types.ts
│   │
│   ├── utils/
│   │   ├── tokenCounter.ts
│   │   ├── chatExporter.ts
│   │   └── formatters.ts
│   │
│   └── constants/
│       ├── models.ts                # All model definitions
│       ├── providers.ts             # Provider metadata
│       └── shortcuts.ts             # Keyboard shortcut map
│
├── public/
├── .env.local
├── tailwind.config.ts
├── next.config.ts
└── components.json                  # Shadcn config
```

---

## Phase-by-Phase Implementation Plan

---

### Phase 1 — Project Scaffolding

**Goal:** Initialize the Next.js 15 project with all dependencies and base config.

#### 1.1 — Create Next.js App

```bash
npx create-next-app@latest neurachat \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd neurachat
```

#### 1.2 — Install All Dependencies

```bash
# UI & Animation
npm install framer-motion lucide-react next-themes

# Shadcn/UI
npx shadcn@latest init
npx shadcn@latest add button input textarea card badge
npx shadcn@latest add dialog popover command tooltip
npx shadcn@latest add dropdown-menu separator scroll-area

# State & Data
npm install zustand @tanstack/react-query

# AI & Streaming
npm install ai @ai-sdk/openai @ai-sdk/mistral @ai-sdk/google

# Markdown
npm install react-markdown rehype-highlight remark-gfm
npm install highlight.js

# Utilities
npm install clsx tailwind-merge class-variance-authority
npm install uuid @types/uuid
```

#### 1.3 — `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme
        surface: {
          DEFAULT: "#0a0a0a",
          1: "#111111",
          2: "#1a1a1a",
          3: "#242424",
        },
        accent: {
          purple: "#8b5cf6",
          blue: "#3b82f6",
          glow: "rgba(139, 92, 246, 0.15)",
        },
        // Light theme
        light: {
          surface: "#ffffff",
          "surface-1": "#f8f9fa",
          "surface-2": "#f1f3f5",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "cursor-blink": "cursorBlink 1s step-end infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0px rgba(139, 92, 246, 0)" },
          "50%": { boxShadow: "0 0 24px rgba(139, 92, 246, 0.4)" },
        },
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
export default config;
```

#### 1.4 — `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
};
export default nextConfig;
```

---

### Phase 2 — Type Definitions

**Goal:** Define all TypeScript interfaces before writing logic.

#### `src/types/model.types.ts`

```ts
export type Provider =
  | "openai"
  | "nvidia"
  | "mistral"
  | "deepseek"
  | "qwen"
  | "google";

export interface ModelDefinition {
  id: string;
  name: string;
  provider: Provider;
  contextLength: number;
  parameterCount: string;
  description: string;
  strengths: string[];
  reasoningLevel: "low" | "medium" | "high" | "extreme";
  codingScore: number; // 0-100
  isNew?: boolean;
  isFeatured?: boolean;
}
```

#### `src/types/chat.types.ts`

```ts
export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  modelId?: string;
  provider?: string;
  isStreaming?: boolean;
  reactions?: string[];
  tokenCount?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  modelId: string;
  provider: string;
  isPinned?: boolean;
}
```

#### `src/types/provider.types.ts`

```ts
import type { ChatMessage } from "./chat.types";
import type { Provider } from "./model.types";

export interface SendMessageParams {
  provider: Provider;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface StreamChunk {
  text: string;
  isComplete: boolean;
}

export interface AIProvider {
  id: Provider;
  name: string;
  apiKeyEnv: string;
  send(params: SendMessageParams): AsyncGenerator<StreamChunk>;
}
```

---

### Phase 3 — Provider Abstraction Layer

**Goal:** A unified interface so adding a new provider means only implementing one class.

#### `src/services/providers/base.provider.ts`

```ts
import type { AIProvider, SendMessageParams, StreamChunk } from "@/types/provider.types";
import type { Provider } from "@/types/model.types";

export abstract class BaseProvider implements AIProvider {
  abstract id: Provider;
  abstract name: string;
  abstract apiKeyEnv: string;

  protected getApiKey(): string {
    const key = process.env[this.apiKeyEnv];
    if (!key) throw new Error(`Missing env var: ${this.apiKeyEnv}`);
    return key;
  }

  abstract send(params: SendMessageParams): AsyncGenerator<StreamChunk>;
}
```

#### `src/services/providers/openai.provider.ts`

```ts
import { BaseProvider } from "./base.provider";
import type { SendMessageParams, StreamChunk } from "@/types/provider.types";
import OpenAI from "openai";

export class OpenAIProvider extends BaseProvider {
  id = "openai" as const;
  name = "OpenAI";
  apiKeyEnv = "OPENAI_API_KEY";

  async *send({ model, messages }: SendMessageParams): AsyncGenerator<StreamChunk> {
    const client = new OpenAI({ apiKey: this.getApiKey() });

    const stream = await client.chat.completions.create({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? "";
      const isComplete = chunk.choices[0]?.finish_reason === "stop";
      if (text) yield { text, isComplete };
    }
  }
}
```

#### `src/services/providers/index.ts`

```ts
import type { AIProvider } from "@/types/provider.types";
import type { Provider } from "@/types/model.types";
import { OpenAIProvider } from "./openai.provider";
import { NvidiaProvider } from "./nvidia.provider";
import { MistralProvider } from "./mistral.provider";
import { DeepSeekProvider } from "./deepseek.provider";
import { QwenProvider } from "./qwen.provider";
import { GoogleProvider } from "./google.provider";

const providers: Record<Provider, AIProvider> = {
  openai: new OpenAIProvider(),
  nvidia: new NvidiaProvider(),
  mistral: new MistralProvider(),
  deepseek: new DeepSeekProvider(),
  qwen: new QwenProvider(),
  google: new GoogleProvider(),
};

export function getProvider(id: Provider): AIProvider {
  const p = providers[id];
  if (!p) throw new Error(`Unknown provider: ${id}`);
  return p;
}

export async function sendMessage(params: Parameters<AIProvider["send"]>[0] & { provider: Provider }) {
  const provider = getProvider(params.provider);
  return provider.send(params);
}
```

#### `src/constants/models.ts`

```ts
import type { ModelDefinition } from "@/types/model.types";

export const MODELS: ModelDefinition[] = [
  {
    id: "mistral-large-3-675b-instruct-2512",
    name: "Mistral Large 3",
    provider: "mistral",
    contextLength: 128000,
    parameterCount: "675B",
    description: "Mistral's flagship large model for reasoning and instruction following.",
    strengths: ["Multilingual", "Reasoning", "Instruction Following"],
    reasoningLevel: "high",
    codingScore: 82,
    isFeatured: true,
  },
  {
    id: "nemotron-3-ultra-550b-a55b",
    name: "Nemotron Ultra",
    provider: "nvidia",
    contextLength: 131072,
    parameterCount: "550B",
    description: "NVIDIA's ultra-scale model optimized for enterprise AI workloads.",
    strengths: ["Scientific Reasoning", "Code", "Math"],
    reasoningLevel: "extreme",
    codingScore: 91,
    isNew: true,
  },
  {
    id: "qwen3-coder-480b-a35b-instruct",
    name: "Qwen3 Coder",
    provider: "qwen",
    contextLength: 256000,
    parameterCount: "480B",
    description: "Qwen's specialized coding model with exceptional long-context support.",
    strengths: ["Code Generation", "Debugging", "Long Context"],
    reasoningLevel: "high",
    codingScore: 96,
  },
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    provider: "deepseek",
    contextLength: 128000,
    parameterCount: "Unknown",
    description: "DeepSeek's flagship pro model with strong reasoning and math capabilities.",
    strengths: ["Math", "Reasoning", "Code"],
    reasoningLevel: "extreme",
    codingScore: 93,
  },
  {
    id: "gpt-oss-120b",
    name: "GPT OSS 120B",
    provider: "openai",
    contextLength: 128000,
    parameterCount: "120B",
    description: "OpenAI's open-weight 120B model with strong general capabilities.",
    strengths: ["General", "Instruction Following", "Creativity"],
    reasoningLevel: "high",
    codingScore: 85,
  },
  // Add remaining models following same pattern...
];

export const getModelById = (id: string) => MODELS.find((m) => m.id === id);
```

---

### Phase 4 — Zustand Store

**Goal:** Global client state for active chat, UI state, and selected model.

#### `src/store/chatStore.ts`

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Conversation, ChatMessage } from "@/types/chat.types";
import { v4 as uuid } from "uuid";

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;

  // Actions
  createConversation: (modelId: string, provider: string) => string;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<ChatMessage, "id" | "createdAt">) => string;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  deleteConversation: (id: string) => void;
  pinConversation: (id: string) => void;
  clearConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: (modelId, provider) => {
        const id = uuid();
        const conversation: Conversation = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          modelId,
          provider,
        };
        set((s) => ({ conversations: [conversation, ...s.conversations], activeConversationId: id }));
        return id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) => {
        const id = uuid();
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, { ...message, id, createdAt: new Date() }],
                  updatedAt: new Date(),
                  title: c.messages.length === 0 ? message.content.slice(0, 40) : c.title,
                }
              : c
          ),
        }));
        return id;
      },

      updateMessage: (conversationId, messageId, content) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, content } : m)) }
              : c
          ),
        })),

      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
        })),

      pinConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)),
        })),

      clearConversation: (id) =>
        set((s) => ({ conversations: s.conversations.map((c) => (c.id === id ? { ...c, messages: [] } : c)) })),

      renameConversation: (id, title) =>
        set((s) => ({ conversations: s.conversations.map((c) => (c.id === id ? { ...c, title } : c)) })),
    }),
    { name: "neurachat-conversations" }
  )
);
```

#### `src/store/uiStore.ts`

```ts
import { create } from "zustand";

interface UIStore {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  commandPaletteOpen: boolean;
  searchDialogOpen: boolean;
  isGenerating: boolean;

  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setCommandPalette: (open: boolean) => void;
  setSearchDialog: (open: boolean) => void;
  setGenerating: (val: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  commandPaletteOpen: false,
  searchDialogOpen: false,
  isGenerating: false,

  toggleLeftSidebar: () => set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  toggleRightSidebar: () => set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
  setCommandPalette: (open) => set({ commandPaletteOpen: open }),
  setSearchDialog: (open) => set({ searchDialogOpen: open }),
  setGenerating: (val) => set({ isGenerating: val }),
}));
```

#### `src/store/modelStore.ts`

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Provider } from "@/types/model.types";

interface ModelStore {
  selectedModelId: string;
  selectedProvider: Provider;
  temperature: number;
  maxTokens: number;

  setModel: (modelId: string, provider: Provider) => void;
  setTemperature: (val: number) => void;
  setMaxTokens: (val: number) => void;
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      selectedModelId: "gpt-oss-120b",
      selectedProvider: "openai",
      temperature: 0.7,
      maxTokens: 4096,

      setModel: (modelId, provider) => set({ selectedModelId: modelId, selectedProvider: provider }),
      setTemperature: (val) => set({ temperature: val }),
      setMaxTokens: (val) => set({ maxTokens: val }),
    }),
    { name: "neurachat-model" }
  )
);
```

---

### Phase 5 — API Routes & Server Actions

**Goal:** Handle streaming on the server, expose clean endpoints.

#### `src/app/api/chat/route.ts`

```ts
import { NextRequest } from "next/server";
import { getProvider } from "@/services/providers";
import type { Provider } from "@/types/model.types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { messages, modelId, provider } = await req.json();

  const aiProvider = getProvider(provider as Provider);
  const stream = aiProvider.send({ provider, model: modelId, messages });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
          if (chunk.isComplete) break;
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

#### `src/actions/chat.actions.ts`

```ts
"use server";

import { revalidatePath } from "next/cache";

export async function generateChatTitle(firstMessage: string): Promise<string> {
  // Use a fast model to generate a title from the first message
  const words = firstMessage.split(" ").slice(0, 6).join(" ");
  return words.length > 40 ? words.slice(0, 40) + "..." : words;
}

export async function exportConversation(conversationJson: string): Promise<{ url: string }> {
  // In production: upload to blob storage and return URL
  // For now: return data URI
  const blob = new Blob([conversationJson], { type: "application/json" });
  const url = `data:application/json;base64,${Buffer.from(conversationJson).toString("base64")}`;
  return { url };
}
```

---

### Phase 6 — Layout Components

**Goal:** Three-column layout with animated sidebar transitions.

#### `src/components/layout/AppShell.tsx`

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { leftSidebarOpen, rightSidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-foreground">
      {/* Left Sidebar */}
      <AnimatePresence initial={false}>
        {leftSidebarOpen && (
          <motion.aside
            key="left-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full border-r border-white/5 overflow-hidden flex-shrink-0"
          >
            <LeftSidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {children}
      </main>

      {/* Right Sidebar */}
      <AnimatePresence initial={false}>
        {rightSidebarOpen && (
          <motion.aside
            key="right-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full border-l border-white/5 overflow-hidden flex-shrink-0"
          >
            <RightSidebar />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
```

#### `src/components/layout/LeftSidebar.tsx` (skeleton)

```tsx
"use client";

import { motion } from "framer-motion";
import { Plus, Search, Pin, Settings, Sun, Moon } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { useModelStore } from "@/store/modelStore";

export function LeftSidebar() {
  const { conversations, activeConversationId, createConversation, setActiveConversation } = useChatStore();
  const { selectedModelId, selectedProvider } = useModelStore();

  const pinned = conversations.filter((c) => c.isPinned);
  const recent = conversations.filter((c) => !c.isPinned);

  return (
    <div className="flex flex-col h-full p-3 gap-2">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500" />
        <span className="font-semibold text-sm tracking-tight">NeuraChat</span>
      </div>

      {/* New Chat Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => createConversation(selectedModelId, selectedProvider)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10
                   border border-white/10 text-sm transition-colors"
      >
        <Plus size={15} />
        New Chat
      </motion.button>

      {/* Search */}
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-muted-foreground">
        <Search size={14} />
        Search chats...
        <kbd className="ml-auto text-xs opacity-50">⌘K</kbd>
      </button>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="mt-2">
          <p className="px-2 text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Pin size={10} /> Pinned
          </p>
          {pinned.map((c) => (
            <ConversationItem key={c.id} conversation={c} isActive={c.id === activeConversationId} onSelect={setActiveConversation} />
          ))}
        </div>
      )}

      {/* Recent */}
      <div className="flex-1 overflow-y-auto mt-2">
        <p className="px-2 text-xs text-muted-foreground mb-1">Recent</p>
        {recent.map((c) => (
          <ConversationItem key={c.id} conversation={c} isActive={c.id === activeConversationId} onSelect={setActiveConversation} />
        ))}
      </div>

      {/* Bottom: Settings, Theme */}
      <div className="border-t border-white/5 pt-2 flex flex-col gap-1">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-muted-foreground">
          <Settings size={14} /> Settings
        </button>
      </div>
    </div>
  );
}
```

---

### Phase 7 — Chat Components

**Goal:** Streaming chat UI with markdown, syntax highlight, reactions.

#### `src/hooks/useStreaming.ts`

```ts
import { useState, useCallback, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { useUIStore } from "@/store/uiStore";

export function useStreaming(conversationId: string) {
  const [streamingContent, setStreamingContent] = useState("");
  const { addMessage, updateMessage } = useChatStore();
  const { setGenerating } = useUIStore();
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, modelId: string, provider: string) => {
      // Add user message
      addMessage(conversationId, { role: "user", content, modelId, provider });

      // Add placeholder assistant message
      const assistantMsgId = addMessage(conversationId, {
        role: "assistant",
        content: "",
        modelId,
        provider,
        isStreaming: true,
      });

      abortRef.current = new AbortController();
      setGenerating(true);
      setStreamingContent("");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [], modelId, provider }), // pass full history from store
          signal: abortRef.current.signal,
        });

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const lines = decoder.decode(value).split("\n");
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const chunk = JSON.parse(data);
              accumulated += chunk.text;
              setStreamingContent(accumulated);
              updateMessage(conversationId, assistantMsgId, accumulated);
            } catch {}
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setGenerating(false);
        setStreamingContent("");
        updateMessage(conversationId, assistantMsgId, streamingContent);
      }
    },
    [conversationId, addMessage, updateMessage, setGenerating]
  );

  const stopGeneration = () => abortRef.current?.abort();

  return { sendMessage, stopGeneration, streamingContent };
}
```

#### `src/components/chat/StreamingMessage.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";

interface StreamingMessageProps {
  content: string;
  isStreaming?: boolean;
}

export function StreamingMessage({ content, isStreaming }: StreamingMessageProps) {
  const [displayPhase, setDisplayPhase] = useState<"thinking" | "generating" | "content">("thinking");

  useEffect(() => {
    if (!isStreaming) return;
    const t1 = setTimeout(() => setDisplayPhase("generating"), 600);
    const t2 = setTimeout(() => setDisplayPhase("content"), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isStreaming]);

  if (isStreaming && displayPhase !== "content") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-muted-foreground text-sm"
      >
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
              animate={{ y: [0, -4, 0] }}
              transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }}
            />
          ))}
        </span>
        <span>{displayPhase === "thinking" ? "Thinking..." : "Generating response..."}</span>
      </motion.div>
    );
  }

  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, className, children, ...props }) {
            const isBlock = className?.includes("language-");
            return isBlock ? (
              <div className="relative group">
                <pre className="rounded-xl bg-surface-2 border border-white/5 p-4 overflow-x-auto text-sm">
                  <code className={className} {...props}>{children}</code>
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(String(children))}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 px-2 py-1
                             text-xs rounded bg-white/10 transition-opacity"
                >
                  Copy
                </button>
              </div>
            ) : (
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 animate-cursor-blink" />
      )}
    </div>
  );
}
```

#### `src/components/chat/ChatInput.tsx`

```tsx
"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send, Square, Paperclip } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

interface ChatInputProps {
  onSend: (content: string) => void;
  onStop: () => void;
}

export function ChatInput({ onSend, onStop }: ChatInputProps) {
  const [value, setValue] = useState("");
  const { isGenerating } = useUIStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div className="p-4">
      <motion.div
        className="relative flex items-end gap-2 rounded-2xl bg-surface-2 border border-white/10
                   focus-within:border-purple-500/50 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.15)]
                   transition-all duration-200 p-3"
        layout
      >
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Paperclip size={16} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground
                     max-h-[200px] overflow-y-auto leading-relaxed"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isGenerating ? onStop : handleSend}
          disabled={!value.trim() && !isGenerating}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40
                     disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {isGenerating ? <Square size={14} fill="white" /> : <Send size={14} />}
        </motion.button>
      </motion.div>
      <p className="text-center text-xs text-muted-foreground mt-2 opacity-50">
        NeuraChat can make mistakes. Verify important info.
      </p>
    </div>
  );
}
```

---

### Phase 8 — Model Components

**Goal:** Right sidebar model detail cards with animations.

#### `src/components/models/ModelCard.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import type { ModelDefinition } from "@/types/model.types";
import { ProviderBadge } from "./ProviderBadge";

const REASONING_COLORS = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  extreme: "text-red-400",
};

interface ModelCardProps {
  model: ModelDefinition;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="rounded-2xl bg-surface-2 border border-white/5 p-4 space-y-4
                 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]
                 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-sm">{model.name}</h3>
          <ProviderBadge provider={model.provider} />
        </div>
        {model.isNew && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            New
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{model.description}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Context" value={`${(model.contextLength / 1000).toFixed(0)}K`} />
        <Stat label="Params" value={model.parameterCount} />
        <Stat label="Reasoning" value={model.reasoningLevel} className={REASONING_COLORS[model.reasoningLevel]} />
        <Stat label="Code Score" value={`${model.codingScore}/100`} />
      </div>

      {/* Strengths */}
      <div className="flex flex-wrap gap-1.5">
        {model.strengths.map((s) => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
            {s}
          </span>
        ))}
      </div>

      {/* Coding Score Bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Coding Score</span>
          <span>{model.codingScore}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${model.codingScore}%` }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-lg bg-white/3 p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-xs font-medium mt-0.5 capitalize ${className}`}>{value}</p>
    </div>
  );
}
```

#### `src/components/models/ModelSelector.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { MODELS } from "@/constants/models";
import { useModelStore } from "@/store/modelStore";
import { ProviderBadge } from "./ProviderBadge";

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const { selectedModelId, setModel } = useModelStore();
  const selected = MODELS.find((m) => m.id === selectedModelId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 border border-white/10
                   hover:border-white/20 transition-all text-sm"
      >
        <span className="font-medium">{selected?.name ?? "Select Model"}</span>
        {selected && <ProviderBadge provider={selected.provider} compact />}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-surface-1 border border-white/10
                       shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
          >
            <div className="p-2 max-h-[400px] overflow-y-auto">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => { setModel(model.id, model.provider); setOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                             hover:bg-white/5 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.parameterCount} params</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProviderBadge provider={model.provider} compact />
                    {model.id === selectedModelId && <Check size={14} className="text-purple-400" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### Phase 9 — Framer Motion Animations

**Goal:** Cohesive animation system across the app.

#### `src/lib/animations.ts`

```ts
// Shared animation variants for consistent motion language

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 250, damping: 22 },
  },
};

export const sidebarSlide = {
  collapsed: { width: 0, opacity: 0 },
  expanded: {
    width: 260,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

export const messageVariant = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export const glowPulse = {
  rest: { boxShadow: "0 0 0px rgba(139, 92, 246, 0)" },
  hover: { boxShadow: "0 0 30px rgba(139, 92, 246, 0.25)" },
};
```

#### Usage in `ChatMessage.tsx`

```tsx
import { motion } from "framer-motion";
import { messageVariant } from "@/lib/animations";

export function ChatMessage({ message, index }) {
  return (
    <motion.div
      variants={messageVariant}
      initial="hidden"
      animate="visible"
      custom={index}
      layout
    >
      {/* message content */}
    </motion.div>
  );
}
```

---

### Phase 10 — Theme System

**Goal:** Seamless dark/light toggle with CSS variables.

#### `src/app/layout.tsx`

```tsx
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/components/providers/QueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --surface: 0 0% 98%;
    --surface-1: 0 0% 96%;
    --surface-2: 0 0% 93%;
    --border: 240 5.9% 90%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 270 91% 65%;
  }

  .dark {
    --background: 0 0% 4%;
    --foreground: 0 0% 96%;
    --surface: 0 0% 4%;
    --surface-1: 0 0% 7%;
    --surface-2: 0 0% 10%;
    --border: 0 0% 14%;
    --muted: 0 0% 14%;
    --muted-foreground: 0 0% 56%;
    --accent: 270 91% 65%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { @apply bg-white/10 rounded-full; }
  ::-webkit-scrollbar-thumb:hover { @apply bg-white/20; }
}
```

---

### Phase 11 — Hooks & Utilities

#### `src/hooks/useKeyboardShortcuts.ts`

```ts
import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

export function useKeyboardShortcuts() {
  const { setCommandPalette, toggleLeftSidebar, toggleRightSidebar } = useUIStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key === "k") { e.preventDefault(); setCommandPalette(true); }
      if (meta && e.key === "b") { e.preventDefault(); toggleLeftSidebar(); }
      if (meta && e.key === "i") { e.preventDefault(); toggleRightSidebar(); }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPalette, toggleLeftSidebar, toggleRightSidebar]);
}
```

#### `src/hooks/useAutoScroll.ts`

```ts
import { useEffect, useRef } from "react";

export function useAutoScroll(dependency: unknown) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [dependency]);

  return bottomRef;
}
```

#### `src/utils/chatExporter.ts`

```ts
import type { Conversation } from "@/types/chat.types";

export function exportAsJSON(conversation: Conversation): void {
  const json = JSON.stringify(conversation, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${conversation.title.replace(/\s+/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsMarkdown(conversation: Conversation): void {
  const md = conversation.messages
    .map((m) => `## ${m.role === "user" ? "You" : "Assistant"}\n\n${m.content}`)
    .join("\n\n---\n\n");
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${conversation.title.replace(/\s+/g, "-")}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

### Phase 12 — Performance & Polish

#### Dynamic imports for heavy components

```tsx
// In ChatContainer
import dynamic from "next/dynamic";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/layout/CommandPalette"), { ssr: false });
```

#### Virtualized message list (react-virtual)

```bash
npm install @tanstack/react-virtual
```

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

const virtualizer = useVirtualizer({
  count: messages.length,
  getScrollElement: () => scrollContainerRef.current,
  estimateSize: () => 120,
  overscan: 5,
});
```

#### Suspense boundaries

```tsx
// In page.tsx
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ChatContainer />
    </Suspense>
  );
}
```

---

## Environment Variables

Create `.env.local` in the project root:

```env
# AI Provider Keys
OPENAI_API_KEY=sk-...
NVIDIA_API_KEY=nvapi-...
MISTRAL_API_KEY=...
DEEPSEEK_API_KEY=sk-...
QWEN_API_KEY=...
GOOGLE_API_KEY=...
OPENROUTER_API_KEY=sk-or-...

# Optional: OpenRouter base URL (routes all providers through one API)
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

> **Tip:** Use [OpenRouter](https://openrouter.ai) as a single API gateway to access all models above through one key. Set `OPENROUTER_API_KEY` and point all providers to the OpenRouter base URL.

---

## Supported Models

| Model ID | Provider | Params | Context |
|---|---|---|---|
| `mistral-large-3-675b-instruct-2512` | Mistral | 675B | 128K |
| `nemotron-3-ultra-550b-a55b` | NVIDIA | 550B | 128K |
| `qwen3-coder-480b-a35b-instruct` | Qwen | 480B | 256K |
| `qwen3.5-397b-a17b` | Qwen | 397B | 128K |
| `deepseek-v4-pro` | DeepSeek | — | 128K |
| `gpt-oss-120b` | OpenAI | 120B | 128K |
| `mistral-medium-3.5-128b` | Mistral | 128B | 128K |
| `gemma-3-27b` | Google | 27B | 128K |
| `gemma-3-12b` | Google | 12B | 128K |
| `deepseek-r1` | DeepSeek | — | 64K |
| `qwen-coder` | Qwen | — | 128K |
| `llama-4` | Meta | — | 128K |

---

## Running Locally

```bash
# Clone & install
git clone https://github.com/your-username/neurachat.git
cd neurachat
npm install

# Set up environment
cp .env.example .env.local
# Add your API keys to .env.local

# Run dev server
npm run dev
# → http://localhost:3000

# Build for production
npm run build
npm start
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` | Open Command Palette |
| `⌘B` | Toggle Left Sidebar |
| `⌘I` | Toggle Right Sidebar (Model Panel) |
| `Enter` | Send message |
| `Shift+Enter` | New line in input |
| `Esc` | Close any dialog |

---

> Built with ❤️ using Next.js 15, Tailwind CSS, Framer Motion, and the Vercel AI SDK.