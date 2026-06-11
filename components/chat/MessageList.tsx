'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { messageVariants } from '@/lib/animations'
import { MessageBubble } from './MessageBubble'
import type { Message } from '@/lib/types'

interface MessageListProps {
  messages: Message[]
  isGenerating: boolean
}

export function MessageList({ messages, isGenerating }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const showThinking = isGenerating && messages.length > 0 && messages[messages.length - 1].role === 'user'

  const messagesToRender = [...messages]
  if (showThinking) {
    messagesToRender.push({
      id: 'temp-generating-msg',
      role: 'assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date(),
      modelId: messages[messages.length - 1].modelId,
    })
  }

  // Auto-scroll to bottom on new messages, streaming updates, or thinking state
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, messages.length, messages[messages.length - 1]?.content, showThinking])

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: 'var(--nc-void)' }}
    >
      <div
        className="mx-auto flex flex-col px-4 pt-6 pb-32"
        style={{
          maxWidth: 768,
          gap: '12px',
        }}
      >
        {messagesToRender.map((message, index) => (
          <motion.div
            key={message.id}
            custom={index}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
          >
            <MessageBubble
              message={message}
              isLatest={index === messagesToRender.length - 1}
            />
          </motion.div>
        ))}

        {/* Bottom sentinel for auto-scroll */}
        <div ref={bottomRef} className="h-32 shrink-0 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  )
}
