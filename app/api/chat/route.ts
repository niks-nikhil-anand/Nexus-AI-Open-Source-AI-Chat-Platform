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
const DEFAULT_MODEL = 'deepseek-ai/deepseek-v4-flash'

const MODEL_ALIASES: Record<string, string> = {
  // Map old frontend model IDs to their closest new equivalents
  'gpt-4o': 'nvidia/nemotron-3-ultra-550b-a55b',
  'claude-3-5-sonnet': 'deepseek-ai/deepseek-v4-flash',
  'claude-4-7-opus': 'nvidia/nemotron-3-ultra-550b-a55b',
  'mistral-large-3': 'mistralai/mistral-small-4-119b-2603',
  'gemini-2-5-pro': 'google/gemma-4-31b-it',
  'nemotron-ultra': 'nvidia/nemotron-3-ultra-550b-a55b',
  'qwen3-coder': 'nvidia/nemotron-3-super-120b-a12b',
  'deepseek-r2': 'deepseek-ai/deepseek-v4-flash',
  'llama-3-1-405b': 'nvidia/nemotron-3-super-120b-a12b',
  // Standard shortcuts mapping to full model IDs
  'nemotron-3-ultra-550b-a55b': 'nvidia/nemotron-3-ultra-550b-a55b',
  'deepseek-v4-flash': 'deepseek-ai/deepseek-v4-flash',
  'mistral-small-4-119b-2603': 'mistralai/mistral-small-4-119b-2603',
  'gemma-4-31b-it': 'google/gemma-4-31b-it',
  'nemotron-3-super-120b-a12b': 'nvidia/nemotron-3-super-120b-a12b',
}

function resolveModel(model: unknown): string {
  if (typeof model !== 'string' || model.trim().length === 0) {
    return DEFAULT_MODEL
  }

  const normalizedModel = model.trim()
  
  if (normalizedModel in MODEL_ALIASES) {
    return MODEL_ALIASES[normalizedModel]
  }

  // To support dynamic models fully, if the input is unrecognized but non-empty,
  // we return it directly so that any NVIDIA API compatible model can be passed.
  return normalizedModel
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
    stream?: unknown
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

  const streamRequested = payload.stream === true

  const upstreamResponse = await fetch(NVIDIA_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: streamRequested ? 'text/event-stream' : 'application/json',
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
      stream: streamRequested,
    }),
  })

  if (!upstreamResponse.ok) {
    const data = (await upstreamResponse.json().catch(() => ({}))) as NvidiaChatResponse
    return NextResponse.json(
      {
        error:
          data.error?.message ??
          `NVIDIA chat completion failed with status ${upstreamResponse.status}.`,
      },
      { status: upstreamResponse.status }
    )
  }

  if (streamRequested) {
    const responseStream = new ReadableStream({
      async start(controller) {
        const reader = upstreamResponse.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }
        const decoder = new TextDecoder()
        let buffer = ''

        try {
          while (true) {
            const { value, done } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed) continue
              if (trimmed === 'data: [DONE]') continue

              if (trimmed.startsWith('data: ')) {
                const dataStr = trimmed.slice(6)
                try {
                  const parsed = JSON.parse(dataStr)
                  const content = parsed.choices?.[0]?.delta?.content
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content))
                  }
                } catch (e) {
                  console.error('Error parsing SSE line:', trimmed, e)
                }
              }
            }
          }
        } catch (err) {
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })
  }

  const data = (await upstreamResponse.json().catch(() => ({}))) as NvidiaChatResponse
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    return NextResponse.json(
      { error: 'NVIDIA returned an empty chat completion.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ content })
}
