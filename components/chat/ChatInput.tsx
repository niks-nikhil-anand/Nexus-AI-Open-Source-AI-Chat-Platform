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
      className="relative flex items-end gap-2 px-4 py-2.5 backdrop-blur-md border border-solid"
      style={{
        backgroundColor: state.theme === 'dark' ? 'rgba(20, 19, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isFocused 
          ? 'var(--nc-accent)' 
          : state.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        borderRadius: '16px', // rounded-2xl
        boxShadow: isFocused ? 'var(--nc-accent-glow)' : '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
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
          minHeight: `${MIN_HEIGHT - 20}px`,
          maxHeight: `${MAX_HEIGHT}px`,
          overflowY: 'hidden',
          padding: '6px 0',
        }}
      />

      <motion.button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        whileTap={canSend ? { scale: 0.9 } : undefined}
        aria-label="Send message"
        className="flex shrink-0 items-center justify-center mb-0.5"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
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
