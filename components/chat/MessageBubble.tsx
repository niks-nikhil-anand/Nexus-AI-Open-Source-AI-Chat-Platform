'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, RefreshCw, ChevronDown, Clock } from 'lucide-react'
import { StreamingIndicator } from './StreamingIndicator'
import type { Message } from '@/lib/types'
import { useChatStore } from '@/lib/store'
import { aiModels } from '@/lib/ai-models'
import { Markdown } from './Markdown'
import { Skeleton } from '@/components/ui/skeleton'
interface MessageBubbleProps {
  message: Message
  isLatest: boolean
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const { state } = useChatStore()
  const { selectedModel } = state

  const [isHovered, setIsHovered] = useState(false)
  const [isThoughtProcessOpen, setIsThoughtProcessOpen] = useState(false)
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
  const model = aiModels.find((m) => m.id === message.modelId) || selectedModel
  const providerEmojis: Record<string, string> = {
    OpenAI: '⚡',
    Anthropic: '🎨',
    NVIDIA: '🟢',
    Mistral: '🍊',
    Alibaba: '💜',
    DeepSeek: '🔵',
    Google: '✨',
    MiniMax: '👾',
    Microsoft: '🟦',
    Meta: '♾️',
    StepFun: '⚡',
    Moonshot: '🌙',
    ByteDance: '🎵',
  }
  const modelEmoji = providerEmojis[model.provider] || '🤖'
  const tokenCount = message.tokens ?? Math.max(1, Math.round(message.content.length / 4.2))

  return (
    <div
      className={`relative flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${isUser ? 'max-w-[80%] md:max-w-[70%]' : 'w-full'}`}>
        {/* Hover toolbar - top right */}
        {!isStreaming && isHovered && (
          <motion.div
            className="absolute top-0 right-0 flex items-center gap-1 bg-[var(--nc-void)] border border-[var(--nc-border)] rounded-lg shadow-sm p-0.5 z-10"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
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

        {/* Thought Process Accordion */}
        {!isUser && message.timeToFirstTokenMs !== undefined && message.timeToFirstTokenMs > 1000 && !isStreaming && (
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setIsThoughtProcessOpen((prev) => !prev)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--nc-text-muted)] hover:text-[var(--nc-text-secondary)] transition-colors"
            >
              <Clock size={12} />
              <span>Thought Process</span>
              <span className="font-mono bg-[var(--nc-surface-2)] px-1.5 py-0.5 rounded-sm border border-[var(--nc-border)]">
                {(message.timeToFirstTokenMs / 1000).toFixed(1)}s
              </span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${isThoughtProcessOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {isThoughtProcessOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 text-sm text-[var(--nc-text-secondary)] bg-[var(--nc-surface-2)] p-3 rounded-lg border border-[var(--nc-border)] italic">
                    The model spent {(message.timeToFirstTokenMs / 1000).toFixed(1)} seconds thinking before generating this response.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Message content */}
        <div
          className="whitespace-pre-wrap break-words"
          style={
            isUser
              ? {
                  backgroundColor: 'var(--nc-user-bubble)',
                  color: 'var(--nc-user-bubble-text)', // properly contrasted text
                  fontSize: 15,
                  padding: '8px 14px',
                  borderRadius: '16px 16px 4px 16px',
                  boxShadow: state.theme === 'dark' ? 'none' : 'var(--shadow-sm)',
                }
              : {
                  backgroundColor: 'transparent',
                  color: '#E2E8F0', // vibrant slate/zinc tone for AI responses
                  fontSize: 15,
                  padding: '2px 0',
                }
          }
        >
          {isUser ? (
            message.content
          ) : isStreaming && message.content.length === 0 ? (
            <div className="space-y-3 py-2 w-[280px] sm:w-[450px]">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[65%]" />
            </div>
          ) : (
            <Markdown content={message.content} isStreaming={isStreaming && message.content.length > 0} />
          )}
        </div>

        {/* Streaming indicator for latest assistant message */}
        {!isUser && isLatest && streamingStage === 'streaming' && (
          <div className="mt-2">
            <StreamingIndicator stage={streamingStage} />
          </div>
        )}

        {/* Subtle, low-contrast metadata footer row */}
        <div 
          className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-400 select-none"
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
