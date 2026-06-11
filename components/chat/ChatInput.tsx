'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useChatStore } from '@/lib/store'

const MAX_HEIGHT = 200
const MIN_HEIGHT = 52

export function ChatInput() {
  const { state, sendMessage } = useChatStore()
  const { isGenerating } = state

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const canSend = value.trim().length > 0 && !isGenerating

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Auto-resize textarea based on content
  const resize = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT)}px`
    textarea.style.overflowY = textarea.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden'
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    resize()
  }

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || isGenerating) return

    sendMessage(trimmed)
    setValue('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.overflowY = 'hidden'
    }

    // Re-focus after send
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="relative flex items-end gap-2 px-3 py-2"
      style={{
        backgroundColor: 'var(--nc-surface-2)',
        border: '1px solid',
        borderColor: isFocused ? 'var(--nc-accent)' : 'var(--nc-border)',
        borderRadius: '10px',
        boxShadow: isFocused ? 'var(--nc-accent-glow)' : 'none',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isGenerating}
        placeholder="Ask anything..."
        rows={1}
        aria-label="Message input"
        className="flex-1 resize-none bg-transparent outline-none"
        style={{
          fontFamily: 'var(--font-sans), Inter, sans-serif',
          fontSize: '15px',
          lineHeight: '1.5',
          color: 'var(--nc-text-primary)',
          minHeight: `${MIN_HEIGHT - 16}px`,
          maxHeight: `${MAX_HEIGHT}px`,
          overflowY: 'hidden',
          padding: '4px 0',
        }}
      />

      <motion.button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        whileTap={canSend ? { scale: 0.9 } : undefined}
        aria-label="Send message"
        className="flex shrink-0 items-center justify-center"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: 'var(--nc-accent)',
          opacity: canSend ? 1 : 0.5,
          cursor: canSend ? 'pointer' : 'not-allowed',
          transition: 'opacity 150ms ease',
        }}
      >
        <ArrowUp className="h-5 w-5 text-white" aria-hidden="true" />
      </motion.button>
    </div>
  )
}
