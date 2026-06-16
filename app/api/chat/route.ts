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

import { aiModels } from '@/lib/ai-models'
import { SYSTEM_PROMPT } from '@/lib/prompts'

function resolveModelInfo(model: unknown): { endpoint: string, provider: string } {
  if (typeof model !== 'string' || model.trim().length === 0) {
    return { endpoint: DEFAULT_MODEL, provider: 'nvidia' }
  }

  const normalizedModel = model.trim()
  
  // Use the alias from the constant aiModels if it matches
  const foundModel = aiModels.find(m => m.id === normalizedModel || m.endpoint === normalizedModel || m.alias === normalizedModel)
  
  if (foundModel) {
    return {
      endpoint: foundModel.alias || foundModel.endpoint || normalizedModel,
      provider: foundModel.provider || 'nvidia'
    }
  }

  return { endpoint: normalizedModel, provider: 'nvidia' }
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
  const nvidiaApiKey = process.env.NVIDIA_API_KEY
  const openrouterApiKey = process.env.OPENROUTER_API_KEY

  // Verify auth token
  let userId: string | null = null
  try {
    const { getServerSession } = await import('next-auth/next')
    const { authOptions } = await import('../auth/[...nextauth]/route')
    const session = await getServerSession(authOptions)
    userId = (session?.user as any)?.id || null
  } catch (err) {
    console.error("Error getting session in chat API:", err)
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

  let apiMessages = [...payload.messages as ChatMessage[]];
  if (apiMessages.length > 0 && apiMessages[0].role === 'system') {
    apiMessages[0] = { ...apiMessages[0], content: apiMessages[0].content + '\n\n' + SYSTEM_PROMPT };
  } else {
    apiMessages.unshift({ role: 'system', content: SYSTEM_PROMPT });
  }

  const modelInfo = resolveModelInfo(payload.model);
  const apiUrl = modelInfo.provider === 'openrouter' ? 'https://openrouter.ai/api/v1/chat/completions' : NVIDIA_CHAT_COMPLETIONS_URL;
  const activeApiKey = modelInfo.provider === 'openrouter' ? openrouterApiKey : nvidiaApiKey;

  if (!activeApiKey) {
    return NextResponse.json(
      { error: `Missing API key for provider ${modelInfo.provider}. Add it to your .env.local file.` },
      { status: 500 }
    )
  }

  const upstreamResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${activeApiKey}`,
      Accept: streamRequested ? 'text/event-stream' : 'application/json',
      'Content-Type': 'application/json',
      ...(modelInfo.provider === 'openrouter' ? {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Nexus AI'
      } : {})
    },
    body: JSON.stringify({
      model: modelInfo.endpoint,
      messages: apiMessages,
      max_tokens: typeof payload.max_tokens === 'number' ? payload.max_tokens : (typeof payload.maxTokens === 'number' ? payload.maxTokens : 4096),
      temperature: typeof payload.temperature === 'number' ? payload.temperature : 1.00,
      top_p: typeof payload.top_p === 'number' ? payload.top_p : 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: streamRequested,
      ...(payload.chat_template_kwargs && modelInfo.provider !== 'openrouter' ? { chat_template_kwargs: payload.chat_template_kwargs } : {}),
    }),
  })

  if (!upstreamResponse.ok) {
    const data = (await upstreamResponse.json().catch(() => ({}))) as NvidiaChatResponse
    return NextResponse.json(
      {
        error:
          data.error?.message ??
          `${modelInfo.provider} chat completion failed with status ${upstreamResponse.status}.`,
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
