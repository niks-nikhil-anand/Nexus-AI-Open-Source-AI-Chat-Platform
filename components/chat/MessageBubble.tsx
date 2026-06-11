'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RefreshCw } from 'lucide-react'
import { StreamingIndicator } from './StreamingIndicator'
import type { Message } from '@/lib/types'
import { useChatStore } from '@/lib/store'
import { mockModels } from '@/lib/mock-data'
import { Markdown } from './Markdown'

interface MessageBubbleProps {
  message: Message
  isLatest: boolean
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const { state } = useChatStore()
  const { selectedModel } = state

  const [isHovered, setIsHovered] = useState(false)
  const isUser = message.role === 'user'
  const isStreaming = message.isStreaming ?? false

  function handleCopy() {
    navigator.clipboard.writeText(message.content)
  }

  // Determine streaming stage for the indicator
  const streamingStage: 'thinking' | 'streaming' | 'complete' = isStreaming
    ? message.content.length === 0
      ? 'thinking'
      : 'streaming'
    : 'complete'

  // Look up model metadata for the badge
  const model = mockModels.find((m) => m.id === message.modelId) || selectedModel
  const providerEmojis: Record<string, string> = {
    OpenAI: '⚡',
    Anthropic: '🎨',
    NVIDIA: '🟢',
    Mistral: '🍊',
    Alibaba: '💜',
    DeepSeek: '🔵',
    Google: '✨',
  }
  const modelEmoji = providerEmojis[model.provider] || '🤖'
  const tokenCount = message.tokens ?? Math.max(1, Math.round(message.content.length / 4.2))

  return (
    <div
      className={`relative flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={isUser ? 'max-w-[80%] md:max-w-[70%]' : 'w-full'}>
        {/* Message content */}
        <div
          className="whitespace-pre-wrap break-words"
          style={
            isUser
              ? {
                  backgroundColor: 'var(--nc-user-bubble)',
                  color: 'rgba(232, 230, 240, 0.82)', // slightly muted user prompt
                  fontSize: 15,
                  padding: '12px 16px',
                  borderRadius: '20px 20px 4px 20px',
                }
              : {
                  backgroundColor: 'transparent',
                  color: '#E2E8F0', // vibrant slate/zinc tone for AI responses
                  fontSize: 15,
                  padding: '4px 0',
                }
          }
        >
          {isUser ? (
            message.content
          ) : (
            <Markdown content={message.content} isStreaming={isStreaming && message.content.length > 0} />
          )}
        </div>

        {/* Streaming indicator for latest assistant message */}
        {!isUser && isLatest && streamingStage !== 'complete' && (
          <div className="mt-2">
            <StreamingIndicator stage={streamingStage} />
          </div>
        )}

        {/* Hover toolbar - only show on completed messages */}
        {!isStreaming && (
          <motion.div
            className="flex items-center gap-1 mt-1"
            style={{
              justifyContent: isUser ? 'flex-end' : 'flex-start',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-[var(--nc-surface-3)]"
              style={{ color: 'var(--nc-text-muted)' }}
              aria-label="Copy message"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            {!isUser && (
              <button
                type="button"
                className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-[var(--nc-surface-3)]"
                style={{ color: 'var(--nc-text-muted)' }}
                aria-label="Regenerate response"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>
        )}

        {/* Subtle, low-contrast metadata footer row */}
        <div 
          className="mt-2.5 flex items-center gap-2 text-[11px] text-[var(--nc-text-muted)] select-none"
          style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}
        >
          <span 
            className="inline-flex items-center gap-1 font-medium text-[var(--nc-text-secondary)]"
          >
            <span>{modelEmoji}</span>
            <span>{model.name}</span>
          </span>
          <span>•</span>
          <span>Tokens: {tokenCount}</span>
          <span>•</span>
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
}
