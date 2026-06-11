import { NextResponse } from 'next/server'

type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

type NvidiaChatResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

const NVIDIA_CHAT_COMPLETIONS_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const DEFAULT_MODEL = 'mistralai/mistral-large-3-675b-instruct-2512'

const MODEL_ALIASES: Record<string, string> = {
  'gpt-4o': DEFAULT_MODEL,
  'claude-3-5-sonnet': DEFAULT_MODEL,
  'mistral-large-3': DEFAULT_MODEL,
  'gemini-2-5-pro': DEFAULT_MODEL,
  'nemotron-ultra': 'nvidia/nemotron-4-340b-instruct',
  'qwen3-coder': 'mistralai/codestral-22b-instruct-v0.1',
  'deepseek-r2': 'deepseek-ai/deepseek-v4-pro',
  'llama-3-1-405b': 'meta/llama-3.3-70b-instruct',
}

function resolveModel(model: unknown): string {
  if (typeof model !== 'string' || model.trim().length === 0) {
    return DEFAULT_MODEL
  }

  const normalizedModel = model.trim()
  
  if (normalizedModel in MODEL_ALIASES) {
    return MODEL_ALIASES[normalizedModel]
  }

  if (normalizedModel.includes('/')) {
    return normalizedModel
  }

  return DEFAULT_MODEL
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false

  const message = value as Partial<ChatMessage>
  return (
    (message.role === 'user' || message.role === 'assistant' || message.role === 'system') &&
    typeof message.content === 'string'
  )
}

export async function POST(request: Request) {
  const apiKey = process.env.NVIDIA_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing NVIDIA_API_KEY. Add it to your .env.local file and restart the dev server.' },
      { status: 500 }
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const payload = body as {
    model?: unknown
    messages?: unknown
    maxTokens?: unknown
    temperature?: unknown
  }

  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    return NextResponse.json({ error: 'messages must be a non-empty array.' }, { status: 400 })
  }

  if (!payload.messages.every(isChatMessage)) {
    return NextResponse.json(
      { error: 'Each message must include role and string content.' },
      { status: 400 }
    )
  }

  const upstreamResponse = await fetch(NVIDIA_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: resolveModel(payload.model),
      messages: payload.messages,
      max_tokens: typeof payload.maxTokens === 'number' ? payload.maxTokens : 2048,
      temperature: typeof payload.temperature === 'number' ? payload.temperature : 0.15,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
    }),
  })

  const data = (await upstreamResponse.json().catch(() => ({}))) as NvidiaChatResponse

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        error:
          data.error?.message ??
          `NVIDIA chat completion failed with status ${upstreamResponse.status}.`,
      },
      { status: upstreamResponse.status }
    )
  }

  const content = data.choices?.[0]?.message?.content

  if (!content) {
    return NextResponse.json(
      { error: 'NVIDIA returned an empty chat completion.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ content })
}
