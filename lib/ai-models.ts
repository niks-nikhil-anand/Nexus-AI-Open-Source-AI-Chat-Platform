import { AIModel, Conversation } from './types'

export const PROVIDER_COLORS = {
  nvidia: '#76B900',
  openrouter: '#10A37F',
} as const

// ─── Mock AI Models ───────────────────────────────────────────────────────────

export const aiModels: AIModel[] = [
  // ==========================================
  // NVIDIA PLATFORM MODELS (provider: 'nvidia')
  // ==========================================
  { id: "nv-deepseek-v4-flash", name: "DeepSeek V4 Flash", company: "DeepSeek", size: "284B", provider: "nvidia", endpoint: "deepseek/v4-flash", status: "FREE", badge: "Reasoning" },
  { id: "nv-deepseek-v4-pro", name: "DeepSeek V4 Pro", company: "DeepSeek", size: "1.6T MoE", provider: "nvidia", endpoint: "deepseek/v4-pro", status: "FREE", badge: "Frontier" },
  { id: "nv-mistral-small-4", name: "Mistral Small 4", company: "Mistral", size: "119B", provider: "nvidia", endpoint: "mistral/small-4", status: "FREE", badge: "Balanced" },
  { id: "nv-ministral-14b-instruct", name: "Ministral 14B Instruct", company: "Mistral", size: "14B", provider: "nvidia", endpoint: "mistral/ministral-14b", status: "FREE", badge: "Fast" },
  { id: "nv-mixtral-8x7b-instruct", name: "Mixtral 8x7B Instruct", company: "Mistral", size: "47B MoE", provider: "nvidia", endpoint: "mistral/mixtral-8x7b", status: "FREE", badge: "General" },
  { id: "nv-nemotron-3-super", name: "Nemotron-3 Super", company: "NVIDIA", size: "120B", provider: "nvidia", endpoint: "nvidia/nemotron-3-super", status: "FREE", badge: "Reasoning" },
  { id: "nv-nemotron-3-ultra", name: "Nemotron-3 Ultra", company: "NVIDIA", size: "550B", provider: "nvidia", endpoint: "nvidia/nemotron-3-ultra", status: "FREE", badge: "Agentic" },
  { id: "nv-gemma-4", name: "Gemma 4", company: "Google", size: "31B IT", provider: "nvidia", endpoint: "google/gemma-4", status: "FREE", badge: "Thinking" },
  { id: "nv-qwen-3-5", name: "Qwen 3.5", company: "Alibaba", size: "122B", provider: "nvidia", endpoint: "alibaba/qwen-3-5", status: "FREE", badge: "Coding" },
  { id: "nv-minimax-m2-7", name: "MiniMax M2.7", company: "MiniMax", size: "M2.7", provider: "nvidia", endpoint: "minimax/m2-7", status: "FREE", badge: "General" },
  { id: "nv-phi-4-mini-instruct", name: "Phi-4 Mini Instruct", company: "Microsoft", size: "3.8B", provider: "nvidia", endpoint: "microsoft/phi-4-mini", status: "FREE", badge: "Edge" },
  { id: "nv-llama-3-3", name: "Llama 3.3", company: "Meta", size: "70B Instruct", provider: "nvidia", endpoint: "meta/llama-3-3", status: "FREE", badge: "Balanced" },
  { id: "nv-step-3-7-flash", name: "Step-3.7 Flash", company: "StepFun", size: "Flash", provider: "nvidia", endpoint: "stepfun/step-3-7-flash", status: "FREE", badge: "Fast" },
  { id: "nv-kimi-k2-6", name: "Kimi K2.6", company: "Moonshot", size: "K2.6", provider: "nvidia", endpoint: "moonshot/kimi-k2-6", status: "FREE", badge: "Chat" },
  { id: "nv-gpt-oss-20b", name: "GPT-OSS 20B", company: "OpenAI", size: "20B", provider: "nvidia", endpoint: "openai/gpt-oss-20b", status: "FREE", badge: "Local" },
  { id: "nv-gpt-oss-120b", name: "GPT-OSS 120B", company: "OpenAI", size: "120B", provider: "nvidia", endpoint: "openai/gpt-oss-120b", status: "FREE", badge: "Reasoning" },
  { id: "nv-seed-oss-36b-instruct", name: "Seed-OSS 36B Instruct", company: "ByteDance", size: "36B", provider: "nvidia", endpoint: "bytedance/seed-oss-36b", status: "FREE", badge: "General" },

  // ==============================================
  // OPENROUTER API MODELS (provider: 'openrouter')
  // ==============================================
  { id: "or-nvidia-nemotron-3-ultra", name: "Nemotron 3 Ultra (free)", company: "NVIDIA", size: "550B MoE", endpoint: "nvidia/nemotron-3-ultra-550b-a55b:free", provider: "openrouter", status: "FREE", badge: "Agentic" },
  { id: "or-nvidia-nemotron-3-super", name: "Nemotron 3 Super (free)", company: "NVIDIA", size: "120B Mamba", endpoint: "nvidia/nemotron-3-super-120b-a12b:free", provider: "openrouter", status: "FREE", badge: "Reasoning" },
  { id: "or-nvidia-nemotron-35-safety", name: "Nemotron 3.5 Content Safety (free)", company: "NVIDIA", size: "4B", endpoint: "nvidia/nemotron-3.5-content-safety:free", provider: "openrouter", status: "FREE", badge: "Guardrail" },
  { id: "or-nvidia-nemotron-3-nano-omni", name: "Nemotron 3 Nano Omni (free)", company: "NVIDIA", size: "30B Multimodal", endpoint: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", provider: "openrouter", status: "FREE", badge: "Omni" },
  { id: "or-nvidia-nemotron-3-nano-30b", name: "Nemotron 3 Nano 30B A3B (free)", company: "NVIDIA", size: "30B MoE", endpoint: "nvidia/nemotron-3-nano-30b-a3b:free", provider: "openrouter", status: "FREE", badge: "Local" },
  { id: "or-nvidia-nemotron-nano-12b", name: "Nemotron Nano 12B 2 VL (free)", company: "NVIDIA", size: "12B Vision", endpoint: "nvidia/nemotron-nano-12b-v2-vl:free", provider: "openrouter", status: "FREE", badge: "Vision" },
  { id: "or-nvidia-nemotron-nano-9b", name: "Nemotron Nano 9B V2 (free)", company: "NVIDIA", size: "9B", endpoint: "nvidia/nemotron-nano-9b-v2:free", provider: "openrouter", status: "FREE", badge: "Reasoning" },
  { id: "or-openai-gpt-oss-120b", name: "gpt-oss-120b (free)", company: "OpenAI", size: "117B MoE", endpoint: "openai/gpt-oss-120b:free", provider: "openrouter", status: "FREE", badge: "Reasoning" },
  { id: "or-openai-gpt-oss-20b", name: "gpt-oss-20b (free)", company: "OpenAI", size: "21B MoE", endpoint: "openai/gpt-oss-20b:free", provider: "openrouter", status: "FREE", badge: "Low Latency" },
  { id: "or-meta-llama-33-70b", name: "Llama 3.3 70B Instruct (free)", company: "Meta", size: "70B", endpoint: "meta-llama/llama-3.3-70b-instruct:free", provider: "openrouter", status: "FREE", badge: "Balanced" },
  { id: "or-meta-llama-32-3b", name: "Llama 3.2 3B Instruct (free)", company: "Meta", size: "3B", endpoint: "meta-llama/llama-3.2-3b-instruct:free", provider: "openrouter", status: "FREE", badge: "Fast" },
  { id: "or-google-gemma-4-26b", name: "Gemma 4 26B A4B (free)", company: "Google", size: "26B MoE", endpoint: "google/gemma-4-26b-a4b-it:free", provider: "openrouter", status: "FREE", badge: "Vision/Text" },
  { id: "or-google-gemma-4-31b", name: "Gemma 4 31B (free)", company: "Google", size: "30.7B", endpoint: "google/gemma-4-31b-it:free", provider: "openrouter", status: "FREE", badge: "Thinking" },
  { id: "or-qwen-qwen3-next-80b", name: "Qwen3 Next 80B A3B Instruct (free)", company: "Qwen", size: "80B", endpoint: "qwen/qwen3-next-80b-a3b-instruct:free", provider: "openrouter", status: "FREE", badge: "RAG/Tools" },
  { id: "or-qwen-qwen3-coder-480b", name: "Qwen3 Coder 480B A35B (free)", company: "Qwen", size: "480B MoE", endpoint: "qwen/qwen3-coder:free", provider: "openrouter", status: "FREE", badge: "Coding" },
  { id: "or-poolside-laguna-xs2", name: "Laguna XS.2 (free)", company: "Poolside", size: "XS.2", endpoint: "poolside/laguna-xs.2:free", provider: "openrouter", status: "FREE", badge: "Reasoning" },
  { id: "or-poolside-laguna-m1", name: "Laguna M.1 (free)", company: "Poolside", size: "M.1", endpoint: "poolside/laguna-m.1:free", provider: "openrouter", status: "FREE", badge: "Coding Agent" },
  { id: "or-liquid-lfm-thinking", name: "LFM2.5-1.2B-Thinking (free)", company: "LiquidAI", size: "1.2B", endpoint: "liquid/lfm-2.5-1.2b-thinking:free", provider: "openrouter", status: "FREE", badge: "Thinking" },
  { id: "or-liquid-lfm-instruct", name: "LFM2.5-1.2B-Instruct (free)", company: "LiquidAI", size: "1.2B", endpoint: "liquid/lfm-2.5-1.2b-instruct:free", provider: "openrouter", status: "FREE", badge: "Fast Edge" },
  { id: "or-nex-n2-pro", name: "Nex-N2-Pro (free)", company: "Nex AGI", size: "302B MoE", endpoint: "nex-agi/nex-n2-pro:free", provider: "openrouter", status: "FREE", badge: "Agentic Loop" },
  { id: "or-venice-uncensored", name: "Venice: Uncensored (free)", company: "Venice", size: "24B", endpoint: "venice/uncensored:free", provider: "openrouter", status: "FREE", badge: "Uncensored" },
  { id: "or-nous-hermes-3-405b", name: "Hermes 3 405B Instruct (free)", company: "Nous", size: "405B", endpoint: "nousresearch/hermes-3-llama-3.1-405b:free", provider: "openrouter", status: "FREE", badge: "Roleplay/Agent" },
  { id: "or-openrouter-auto-free", name: "Auto-Routing Endpoint (free)", company: "OpenRouter", size: "Dynamic", endpoint: "openrouter/free", provider: "openrouter", status: "FREE", badge: "Auto Router" }
];

export const mockConversations: Conversation[] = []
