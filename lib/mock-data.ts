import { AIModel, Conversation } from './types'

// Provider colors
export const PROVIDER_COLORS = {
  OpenAI: '#10A37F',
  NVIDIA: '#76B900',
  Mistral: '#FF7000',
  DeepSeek: '#4D6EF5',
  Alibaba: '#9B59B6',
  Google: '#EA4335',
  Anthropic: '#D4A574',
} as const

// ─── Mock AI Models ───────────────────────────────────────────────────────────

export const mockModels: AIModel[] = [
  {
    id: 'nvidia/nemotron-3-ultra-550b-a55b',
    name: 'Nemotron-3 Ultra 550B',
    provider: 'NVIDIA',
    description:
      'A massive 550B parameter hybrid Mamba-Transformer Mixture of Experts (MoE) model. It boasts a 1M context window and is specifically optimized for frontier agentic reasoning, planning, and advanced coding tasks.',
    contextWindow: 1000000,
    parameters: '550B',
    reasoningScore: 96,
    codingScore: 95,
    strengths: ['Reasoning', 'Planning', 'Agentic Workflows', 'Coding'],
    providerColor: PROVIDER_COLORS.NVIDIA,
    isNew: true,
  },
  {
    id: 'deepseek-ai/deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    provider: 'DeepSeek',
    description:
      'A highly efficient 284B MoE model featuring a 1M-token context window. It is purpose-built for lightning-fast coding assistance and complex agentic workflows.',
    contextWindow: 1000000,
    parameters: '284B',
    reasoningScore: 91,
    codingScore: 94,
    strengths: ['Coding', 'Speed', 'Agentic Workflows'],
    providerColor: PROVIDER_COLORS.DeepSeek,
    isNew: true,
  },
  {
    id: 'mistralai/mistral-small-4-119b-2603',
    name: 'Mistral Small 4 119B',
    provider: 'Mistral',
    description:
      'A hybrid MoE model that unifies instruction-following, reasoning, and coding with a generous 256k context window and multimodal support.',
    contextWindow: 262144,
    parameters: '119B',
    reasoningScore: 88,
    codingScore: 89,
    strengths: ['Multimodal', 'Reasoning', 'Coding', 'Instruction Following'],
    providerColor: PROVIDER_COLORS.Mistral,
    isNew: true,
  },
  {
    id: 'google/gemma-4-31b-it',
    name: 'Gemma 4 31B IT',
    provider: 'Google',
    description:
      'A highly dense 31B model that delivers frontier-level reasoning and coding capabilities relative to its compact size, making it incredibly fast and efficient.',
    contextWindow: 131072,
    parameters: '31B',
    reasoningScore: 90,
    codingScore: 91,
    strengths: ['Reasoning', 'Coding', 'Speed', 'Efficiency'],
    providerColor: PROVIDER_COLORS.Google,
    isNew: true,
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b',
    name: 'Nemotron-3 Super 120B',
    provider: 'NVIDIA',
    description:
      'A 120B MoE hybrid model that balances speed and deep intelligence, excelling at code generation, tool calling, and structured logical planning.',
    contextWindow: 131072,
    parameters: '120B',
    reasoningScore: 92,
    codingScore: 93,
    strengths: ['Coding', 'Tool Calling', 'Planning', 'Speed'],
    providerColor: PROVIDER_COLORS.NVIDIA,
    isNew: true,
  },
]

export const mockConversations: Conversation[] = []

