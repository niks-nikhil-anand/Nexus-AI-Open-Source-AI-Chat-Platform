import { AIModel, Conversation } from './types'

// Provider colors
export const PROVIDER_COLORS = {
  nvidia: '#76B900',
  openrouter: '#10A37F',
} as const

// ─── Mock AI Models ───────────────────────────────────────────────────────────

export const mockModels: AIModel[] = [
  {
    "id": "nvidia/nemotron-3-ultra-550b-a55b:free",
    "name": "NVIDIA: Nemotron 3 Ultra",
    "provider": "nvidia",
    "description": "A 550B total parameter hybrid MoE architecture built for complex agentic workflows and multi-step orchestration (1M context).",
    "status": "free",
    "strengths": [
      "Agentic"
    ],
    "providerColor": "#76B900"
  },
  {
    "id": "nvidia/nemotron-3-super-120b-a12b:free",
    "name": "NVIDIA: Nemotron 3 Super",
    "provider": "nvidia",
    "description": "A 120B parameter hybrid Mamba-Transformer MoE optimized for cross-document reasoning and multi-agent systems (1M context).",
    "status": "free",
    "strengths": [
      "Reasoning"
    ],
    "providerColor": "#76B900"
  },
  {
    "id": "nvidia/nemotron-3.5-content-safety:free",
    "name": "NVIDIA: Nemotron 3.5 Content Safety",
    "provider": "nvidia",
    "description": "A compact 4B parameter multimodal guardrail model fine-tuned from Gemma-3 for prompt/response filtering.",
    "status": "free",
    "strengths": [
      "Multimodal"
    ],
    "providerColor": "#76B900"
  },
  {
    "id": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    "name": "NVIDIA: Nemotron 3 Nano Omni",
    "provider": "nvidia",
    "description": "A 30B open multimodal perception sub-agent accepting text, image, video, and audio inputs.",
    "status": "free",
    "strengths": [
      "Agentic"
    ],
    "providerColor": "#76B900"
  },
  {
    "id": "nvidia/nemotron-3-nano-30b-a3b:free",
    "name": "NVIDIA: Nemotron 3 Nano 30B A3B",
    "provider": "nvidia",
    "description": "A privacy-focused open-weight MoE designed for specialized local agent architecture.",
    "status": "free",
    "strengths": [
      "Agentic"
    ],
    "providerColor": "#76B900"
  },
  {
    "id": "nvidia/nemotron-nano-12b-v2-vl:free",
    "name": "NVIDIA: Nemotron Nano 12B 2 VL",
    "provider": "nvidia",
    "description": "A 12B parameter multimodal reasoning model optimized for document intelligence and video understanding.",
    "status": "free",
    "strengths": [
      "Reasoning"
    ],
    "providerColor": "#76B900"
  },
  {
    "id": "nvidia/nemotron-nano-9b-v2:free",
    "name": "NVIDIA: Nemotron Nano 9B V2",
    "provider": "nvidia",
    "description": "A unified 9B model that defaults to structured reasoning traces before providing final answers.",
    "status": "free",
    "strengths": [
      "Reasoning"
    ],
    "providerColor": "#76B900"
  },
  {
    "id": "openai/gpt-oss-120b:free",
    "name": "OpenAI: gpt-oss-120b",
    "provider": "openrouter",
    "description": "An open-weight 117B parameter MoE built for high-reasoning tasks and structured output generation.",
    "status": "free",
    "strengths": [
      "Reasoning"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "openai/gpt-oss-20b:free",
    "name": "OpenAI: gpt-oss-20b",
    "provider": "openrouter",
    "description": "A low-latency 21B MoE model optimized for single-GPU enterprise or local deployments.",
    "status": "free",
    "strengths": [
      "General"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "meta-llama/llama-3.3-70b-instruct:free",
    "name": "Meta: Llama 3.3 70B Instruct",
    "provider": "openrouter",
    "description": "Multilingual dialogue model optimized for reasoning, code assistance, and general instruction following.",
    "status": "free",
    "strengths": [
      "Reasoning"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "meta-llama/llama-3.2-3b-instruct:free",
    "name": "Meta: Llama 3.2 3B Instruct",
    "provider": "openrouter",
    "description": "Highly efficient, lightweight multilingual edge model optimized for summarization and fast tasks.",
    "status": "free",
    "strengths": [
      "General"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "google/gemma-4-26b-a4b-it:free",
    "name": "Google: Gemma 4 26B A4B",
    "provider": "openrouter",
    "description": "Google DeepMind's efficient MoE instruction-tuned model for text, images, and video.",
    "status": "free",
    "strengths": [
      "General"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "google/gemma-4-31b-it:free",
    "name": "Google: Gemma 4 31B",
    "provider": "openrouter",
    "description": "A dense 30.7B parameter multimodal model featuring a togglable thinking mode.",
    "status": "free",
    "strengths": [
      "Multimodal"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "qwen/qwen3-next-80b-a3b-instruct:free",
    "name": "Qwen: Qwen3 Next 80B A3B Instruct",
    "provider": "openrouter",
    "description": "Optimized for production throughput, tool calls, and steady RAG pipelines without exposing visible CoT.",
    "status": "free",
    "strengths": [
      "General"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "qwen/qwen3-coder:free",
    "name": "Qwen: Qwen3 Coder 480B A35B",
    "provider": "openrouter",
    "description": "Massive open MoE fine-tuned explicitly for codebase reasoning and multi-file software engineering.",
    "status": "free",
    "strengths": [
      "Reasoning"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "poolside/laguna-xs.2:free",
    "name": "Poolside: Laguna XS.2",
    "provider": "openrouter",
    "description": "Second-generation lightweight developer companion optimized for fast syntax corrections and reasoning.",
    "status": "free",
    "strengths": [
      "Reasoning"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "poolside/laguna-m.1:free",
    "name": "Poolside: Laguna M.1",
    "provider": "openrouter",
    "description": "Flagship coding agent designed to parse complex logic and interact cleanly with programming tools.",
    "status": "free",
    "strengths": [
      "Coding"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "liquid/lfm-2.5-1.2b-thinking:free",
    "name": "LiquidAI: LFM2.5-1.2B-Thinking",
    "provider": "openrouter",
    "description": "Lightweight on-device architecture with extended thinking capabilities for data extraction and RAG.",
    "status": "free",
    "strengths": [
      "General"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "liquid/lfm-2.5-1.2b-instruct:free",
    "name": "LiquidAI: LFM2.5-1.2B-Instruct",
    "provider": "openrouter",
    "description": "Fast, instruction-aligned edge framework for conversational assistance.",
    "status": "free",
    "strengths": [
      "General"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "nex-agi/nex-n2-pro:free",
    "name": "Nex AGI: Nex-N2-Pro",
    "provider": "openrouter",
    "description": "A 302B token agentic MoE model mapping planning, code debugging, and tool loops on top of Qwen3.5.",
    "status": "free",
    "strengths": [
      "Agentic"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "venice/uncensored:free",
    "name": "Venice: Uncensored",
    "provider": "openrouter",
    "description": "A 24B Mistral-based fine-tune developed to preserve steerability without mainstream safety/alignment layers.",
    "status": "free",
    "strengths": [
      "General"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "nousresearch/hermes-3-llama-3.1-405b:free",
    "name": "Nous: Hermes 3 405B Instruct",
    "provider": "openrouter",
    "description": "Frontier-level full parameter fine-tune of Llama 3.1 405B focusing on extreme user roleplay and advanced agent alignment.",
    "status": "free",
    "strengths": [
      "Agentic"
    ],
    "providerColor": "#10A37F"
  },
  {
    "id": "openrouter/free",
    "name": "OpenRouter: free",
    "provider": "openrouter",
    "description": "An automated auto-routing endpoint that analyzes your request constraints (like tools or images) and distributes traffic dynamically among active free providers.",
    "status": "free",
    "strengths": [
      "Auto-Routing"
    ],
    "providerColor": "#10A37F"
  }
]

export const mockConversations: Conversation[] = []

