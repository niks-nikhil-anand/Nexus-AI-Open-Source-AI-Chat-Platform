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

  // Auto-scroll to bottom on new messages or streaming updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, messages.length, messages[messages.length - 1]?.content])

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: 'var(--nc-void)' }}
    >
      <div
        className="mx-auto flex flex-col px-4 pt-6 pb-32"
        style={{
          maxWidth: 768,
          gap: 'var(--space-6)',
        }}
      >
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            custom={index}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
          >
            <MessageBubble
              message={message}
              isLatest={index === messages.length - 1}
            />
          </motion.div>
        ))}

        {/* Bottom sentinel for auto-scroll */}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </div>
  )
}
