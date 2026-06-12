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
  // New model mappings
  'deepseek-v4-pro': 'deepseek-ai/deepseek-v4-pro',
  'deepseek-ai/deepseek-v4-pro': 'deepseek-ai/deepseek-v4-pro',
  'ministral-14b-instruct-2512': 'mistralai/ministral-14b-instruct-2512',
  'mistralai/ministral-14b-instruct-2512': 'mistralai/ministral-14b-instruct-2512',
  'mixtral-8x7b-instruct-v0.1': 'mistralai/mixtral-8x7b-instruct-v0.1',
  'mistralai/mixtral-8x7b-instruct-v0.1': 'mistralai/mixtral-8x7b-instruct-v0.1',
  'qwen3.5-122b-a10b': 'qwen/qwen3.5-122b-a10b',
  'qwen/qwen3.5-122b-a10b': 'qwen/qwen3.5-122b-a10b',
  'minimax-m2.7': 'minimaxai/minimax-m2.7',
  'minimaxai/minimax-m2.7': 'minimaxai/minimax-m2.7',
  'phi-4-mini-instruct': 'microsoft/phi-4-mini-instruct',
  'microsoft/phi-4-mini-instruct': 'microsoft/phi-4-mini-instruct',
  'llama-3.3-70b-instruct': 'meta/llama-3.3-70b-instruct',
  'meta/llama-3.3-70b-instruct': 'meta/llama-3.3-70b-instruct',
  'step-3.7-flash': 'stepfun-ai/step-3.7-flash',
  'stepfun-ai/step-3.7-flash': 'stepfun-ai/step-3.7-flash',
  'kimi-k2.6': 'moonshotai/kimi-k2.6',
  'moonshotai/kimi-k2.6': 'moonshotai/kimi-k2.6',
  'gpt-oss-20b': 'openai/gpt-oss-20b',
  'openai/gpt-oss-20b': 'openai/gpt-oss-20b',
  'gpt-oss-120b': 'openai/gpt-oss-120b',
  'openai/gpt-oss-120b': 'openai/gpt-oss-120b',
  'seed-oss-36b-instruct': 'bytedance/seed-oss-36b-instruct',
  'bytedance/seed-oss-36b-instruct': 'bytedance/seed-oss-36b-instruct',
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

  // Verify auth token
  const cookieStore = await import('next/headers').then(m => m.cookies())
  const token = cookieStore.get('authToken')?.value
  let userId: string | null = null
  if (token) {
    try {
      const { jwtVerify } = await import('jose')
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback_secret_key_for_development_only"
      )
      const { payload } = await jwtVerify(token, secret)
      userId = payload.userId as string
    } catch {
      // Ignored
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const payload = body as {
    chatId?: string
    model?: unknown
    messages?: unknown
    max_tokens?: unknown
    maxTokens?: unknown
    temperature?: unknown
    top_p?: unknown
    stream?: unknown
    chat_template_kwargs?: unknown
  }

  if (!payload.chatId) {
    return NextResponse.json({ error: 'chatId is required.' }, { status: 400 })
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

  const userMessageContent = payload.messages[payload.messages.length - 1].content

  // Check if chat belongs to user and exists
  const { prisma } = await import('@/lib/prisma')
  const chat = await prisma.chat.findUnique({
    where: { id: payload.chatId, userId }
  })

  if (!chat) {
    return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 })
  }

  // Save the user message to the DB
  await prisma.message.create({
    data: {
      content: userMessageContent,
      role: 'user',
      chatId: payload.chatId
    }
  })

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
      max_tokens: typeof payload.max_tokens === 'number' ? payload.max_tokens : (typeof payload.maxTokens === 'number' ? payload.maxTokens : 4096),
      temperature: typeof payload.temperature === 'number' ? payload.temperature : 1.00,
      top_p: typeof payload.top_p === 'number' ? payload.top_p : 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: streamRequested,
      ...(payload.chat_template_kwargs ? { chat_template_kwargs: payload.chat_template_kwargs } : {}),
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
    let assistantResponse = ''
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
                    assistantResponse += content
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
          // Stream is done, save assistant message
          if (assistantResponse) {
            try {
              await prisma.message.create({
                data: {
                  content: assistantResponse,
                  role: 'assistant',
                  chatId: payload.chatId as string
                }
              })
              // Update chat updated at
              await prisma.chat.update({
                where: { id: payload.chatId as string },
                data: { updatedAt: new Date() }
              })
            } catch (dbErr) {
              console.error("Failed to save assistant message", dbErr)
            }
          }
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

  // Save the assistant message to the DB for non-streaming response
  try {
    await prisma.message.create({
      data: {
        content: content,
        role: 'assistant',
        chatId: payload.chatId
      }
    })
    await prisma.chat.update({
      where: { id: payload.chatId },
      data: { updatedAt: new Date() }
    })
  } catch (dbErr) {
    console.error("Failed to save non-streaming assistant message", dbErr)
  }

  return NextResponse.json({ content })
}
