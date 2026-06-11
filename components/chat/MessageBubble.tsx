'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RefreshCw } from 'lucide-react'
import { StreamingIndicator } from './StreamingIndicator'
import type { Message } from '@/lib/types'

interface MessageBubbleProps {
  message: Message
  isLatest: boolean
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
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

  return (
    <div
      className={`relative flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={isUser ? 'max-w-[70%]' : 'w-full'}
      >
        {/* Message content */}
        <div
          className="whitespace-pre-wrap break-words"
          style={
            isUser
              ? {
                  backgroundColor: 'var(--nc-user-bubble)',
                  color: 'var(--nc-text-primary)',
                  fontSize: 15,
                  padding: '12px 16px',
                  borderRadius: '20px 20px 4px 20px',
                }
              : {
                  backgroundColor: 'transparent',
                  color: 'var(--nc-text-primary)',
                  fontSize: 15,
                  padding: '4px 0',
                }
          }
        >
          {message.content}
          {isStreaming && message.content.length > 0 && (
            <span
              className="ml-0.5 inline-block h-[18px] w-[2px] animate-pulse"
              style={{ backgroundColor: 'var(--nc-accent)' }}
              aria-hidden="true"
            />
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
      </div>
    </div>
  )
}
