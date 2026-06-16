'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { CopyIcon, RefreshIcon, ChevronDownIcon, Clock01Icon } from '@hugeicons/core-free-icons'
import { StreamingIndicator } from './StreamingIndicator'
import type { Message } from '@/lib/types'
import { useChatStore } from '@/lib/store'
import { aiModels } from '@/lib/ai-models'
import { Markdown } from './Markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

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
            className="absolute top-0 right-0 flex items-center gap-1 bg-devkit-bg-subtle/95 backdrop-blur border border-devkit-bg-muted rounded-devkit shadow-md p-1 z-10"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center rounded-devkit p-1.5 transition-all text-devkit-text-secondary hover:bg-devkit-bg-muted hover:text-devkit-text cursor-pointer"
              aria-label="Copy message"
            >
              <HugeiconsIcon icon={CopyIcon} size={14} />
            </button>
            {!isUser && (
              <button
                type="button"
                className="flex items-center justify-center rounded-devkit p-1.5 transition-all text-devkit-text-secondary hover:bg-devkit-bg-muted hover:text-devkit-text cursor-pointer"
                aria-label="Regenerate response"
              >
                <HugeiconsIcon icon={RefreshIcon} size={14} />
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
              className="flex items-center gap-1.5 text-[11px] font-semibold text-devkit-text-secondary hover:text-devkit-text bg-devkit-bg-subtle hover:bg-devkit-bg-muted border border-devkit-bg-muted rounded-devkit px-3 py-1.5 transition-all cursor-pointer shadow-sm"
            >
              <HugeiconsIcon icon={Clock01Icon} size={12} />
              <span>Thought Process</span>
              <span className="font-mono bg-devkit-bg text-devkit-accent border border-devkit-bg-muted px-1.5 py-0.5 rounded-sm">
                {(message.timeToFirstTokenMs / 1000).toFixed(1)}s
              </span>
              <HugeiconsIcon
                icon={ChevronDownIcon}
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
                  <div className="mt-2 text-xs text-devkit-text-secondary bg-devkit-bg-subtle p-4 rounded-lg-devkit border border-devkit-bg-muted italic shadow-inner">
                    The model spent {(message.timeToFirstTokenMs / 1000).toFixed(1)} seconds thinking before generating this response.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Message content */}
        <div
          className={cn(
            'break-words text-[15px] font-sans leading-relaxed transition-colors duration-300',
            isUser
              ? 'whitespace-pre-wrap bg-devkit-accent/10 border border-devkit-accent/20 text-devkit-text rounded-[18px_18px_4px_18px] px-4.5 py-3 shadow-sm'
              : 'bg-transparent text-devkit-text py-1 w-full'
          )}
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
          className={cn(
            "mt-2 flex items-center gap-2 text-[10px] text-devkit-text-tertiary select-none font-mono",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span 
            className="inline-flex items-center gap-1.5 bg-devkit-bg-subtle border border-devkit-bg-muted rounded-devkit px-2 py-0.5 text-[10px] text-devkit-text-secondary font-medium font-sans"
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
