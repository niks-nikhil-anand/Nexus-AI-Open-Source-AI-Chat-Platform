'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Plus, ChevronDown, Mic, ArrowUp, Square, Settings2, Brain } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { InputModelSelector } from './InputModelSelector'
import { ParameterPopover } from './ParameterPopover'

const MAX_HEIGHT = 200

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

export function ChatInput() {
  const { state, dispatch, sendMessage, stopGeneration } = useChatStore()
  const { isGenerating } = state

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [parameterPopoverOpen, setParameterPopoverOpen] = useState(false)

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

  const hasText = value.trim().length > 0

  return (
    <div
      className="relative flex flex-col justify-between w-full shadow-2xl transition-all duration-200 z-20 border border-solid"
      style={{
        backgroundColor: state.theme === 'dark' ? '#121212' : '#FFFFFF',
        borderColor: isFocused
          ? 'var(--nc-accent)'
          : state.theme === 'dark' ? '#262626' : '#DDDBE8',
        borderRadius: '24px',
        padding: '16px 16px 12px 16px',
        boxShadow: isFocused ? 'var(--nc-accent-glow)' : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Top Row: Auto-growing Textarea */}
      <div className="w-full">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What's on your mind?"
          rows={1}
          aria-label="Message input"
          className="w-full resize-none bg-transparent outline-none text-[15px] leading-relaxed placeholder-[#8E8E93]"
          style={{
            fontFamily: 'var(--font-sans), Inter, sans-serif',
            color: state.theme === 'dark' ? '#FFFFFF' : 'var(--nc-text-primary)',
            caretColor: state.theme === 'dark' ? '#FFFFFF' : 'var(--nc-accent)',
            minHeight: '28px',
            overflowY: 'hidden',
          }}
        />
      </div>

      {/* Bottom Row: Controls */}
      <div className="flex items-center justify-between mt-3 w-full">
        {/* Left Side: Attachment Button */}
        <div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--nc-surface-2)] text-[var(--nc-text-secondary)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] active:scale-90 transition-all cursor-pointer border border-[var(--nc-border)]"
            title="Attach files"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Right Side: Config Cluster & Action Button */}
        <div className="flex items-center gap-2">
          
          {/* Model Selector dropdown pill */}
          <div className="relative flex items-center hidden sm:flex">
            <button
              type="button"
              onClick={() => setModelDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold bg-[var(--nc-surface-2)] hover:bg-[var(--nc-surface-3)] text-[var(--nc-text-primary)] border border-[var(--nc-border)] active:scale-95 transition-all cursor-pointer h-[34px]"
            >
              <span className="text-xs leading-none">
                {providerEmojis[state.selectedModel.provider] || '🤖'}
              </span>
              <span className="max-w-[100px] truncate">{state.selectedModel.name}</span>
              <ChevronDown size={11} className="opacity-60 ml-0.5" />
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

          {/* Thinking Mode Toggle */}
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_THINKING', payload: !state.enable_thinking })}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer border h-[34px] ${
              state.enable_thinking
                ? 'bg-[var(--nc-accent-dim)] text-[var(--nc-accent)] border-[var(--nc-accent)]/30 shadow-[0_0_12px_rgba(124,106,255,0.2)]'
                : 'bg-[var(--nc-surface-2)] text-[var(--nc-text-secondary)] border-[var(--nc-border)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)]'
            }`}
            title="Toggle Deep Thinking Mode"
          >
            <Brain size={13} className={state.enable_thinking ? "text-[var(--nc-accent)]" : "opacity-70"} />
            <span className="hidden sm:inline">Thinking</span>
          </button>

          {/* Inference Settings Gear & Popover */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setParameterPopoverOpen(prev => !prev)}
              className={`flex h-[34px] w-[34px] items-center justify-center rounded-full transition-all cursor-pointer border ${
                parameterPopoverOpen 
                  ? 'bg-[var(--nc-accent-dim)] text-[var(--nc-accent)] border-[var(--nc-accent)]/30' 
                  : 'bg-[var(--nc-surface-2)] text-[var(--nc-text-secondary)] border-[var(--nc-border)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)]'
              }`}
              title="Inference Settings"
            >
              <Settings2 size={14} className={parameterPopoverOpen ? 'rotate-90 transition-transform' : 'transition-transform'} />
            </button>
            <ParameterPopover
              isOpen={parameterPopoverOpen}
              onClose={() => setParameterPopoverOpen(false)}
            />
          </div>

          {/* Dynamic Action Button */}
          {isGenerating ? (
            <button
              type="button"
              onClick={stopGeneration}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full transition-all duration-200 shadow-md cursor-pointer bg-red-500 text-white hover:bg-red-600 active:scale-90"
              title="Stop generating"
            >
              <Square size={13} fill="currentColor" />
            </button>
          ) : hasText ? (
            <button
              type="button"
              onClick={handleSend}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full transition-all duration-200 shadow-md cursor-pointer bg-[var(--nc-text-primary)] text-[var(--nc-void)] hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black active:scale-90"
              title="Send message"
            >
              <ArrowUp size={15} strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="button"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full transition-all duration-200 shadow-sm cursor-pointer bg-[var(--nc-surface-2)] text-[var(--nc-text-secondary)] hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black active:scale-90 border border-[var(--nc-border)]"
              title="Voice input"
            >
              <Mic size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
