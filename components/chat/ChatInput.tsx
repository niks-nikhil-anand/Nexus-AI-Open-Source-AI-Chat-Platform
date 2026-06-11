'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, ChevronDown, Mic, ArrowUp } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { InputModelSelector } from './InputModelSelector'

const MAX_HEIGHT = 200

export function ChatInput() {
  const { state, dispatch, sendMessage } = useChatStore()
  const { isGenerating } = state

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)

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
      className="relative flex flex-col gap-2.5 px-4 py-3 backdrop-blur-md border border-solid"
      style={{
        backgroundColor: state.theme === 'dark' ? 'rgba(20, 19, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isFocused 
          ? 'var(--nc-accent)' 
          : state.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        borderRadius: '20px', // rounded-2xl capsule design
        boxShadow: isFocused ? 'var(--nc-accent-glow)' : '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
      }}
    >
      {/* Top: Textarea */}
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
        className="w-full resize-none bg-transparent outline-none text-[15px] leading-relaxed"
        style={{
          fontFamily: 'var(--font-sans), Inter, sans-serif',
          color: 'var(--nc-text-primary)',
          minHeight: `28px`,
          maxHeight: `${MAX_HEIGHT}px`,
          overflowY: 'hidden',
          padding: '2px 0',
        }}
      />

      {/* Bottom: Action buttons and Model Select */}
      <div className="flex items-center justify-between mt-1 select-none z-20">
        {/* Left: Plus attachment button */}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--nc-surface-3)] text-[var(--nc-text-secondary)] hover:bg-[var(--nc-surface-2)] hover:text-[var(--nc-text-primary)] active:scale-95 transition-all cursor-pointer"
          title="Attach files"
        >
          <Plus size={15} />
        </button>

        {/* Right: Model Select Pill + Action Button */}
        <div className="flex items-center gap-2">
          {/* Model Select Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setModelDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-[var(--nc-surface-3)] hover:bg-[var(--nc-surface-2)] text-[var(--nc-text-primary)] border border-[var(--nc-border)] active:scale-95 transition-all cursor-pointer"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: state.selectedModel.providerColor }}
              />
              <span>{state.selectedModel.name}</span>
              <ChevronDown size={12} className="opacity-60" />
            </button>

            {/* Upwards floating selector dropdown */}
            <InputModelSelector
              isOpen={modelDropdownOpen}
              onClose={() => setModelDropdownOpen(false)}
              onSelect={(model) => {
                dispatch({ type: 'SET_MODEL', payload: model })
              }}
              currentModelId={state.selectedModel.id}
            />
          </div>

          {/* Action button: Send or Microphone */}
          <motion.button
            type="button"
            onClick={value.trim().length > 0 ? handleSend : undefined}
            whileTap={value.trim().length > 0 ? { scale: 0.95 } : undefined}
            aria-label={value.trim().length > 0 ? "Send message" : "Voice input"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all shadow-sm cursor-pointer"
            style={{
              opacity: isGenerating ? 0.5 : 1,
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {value.trim().length > 0 ? (
              <ArrowUp size={15} strokeWidth={2.5} />
            ) : (
              <Mic size={15} strokeWidth={2} />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
