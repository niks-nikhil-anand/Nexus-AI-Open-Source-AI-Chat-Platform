'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Add01Icon, ChevronDownIcon, Mic01Icon, ArrowUp01Icon, StopIcon, Settings02Icon, Brain01Icon } from '@hugeicons/core-free-icons'
import { useChatStore } from '@/lib/store'
import { InputModelSelector } from './InputModelSelector'
import { ParameterPopover } from './ParameterPopover'
import { cn } from '@/lib/utils'

const MAX_HEIGHT = 200

const providerEmojis: Record<string, string> = {
  nvidia: '🟢',
  openrouter: '⚡',
}

function ThinkingTimer({
  isWaiting,
  isThinkingModeEnabled,
  onToggleThinking,
}: {
  isWaiting: boolean
  isThinkingModeEnabled: boolean
  onToggleThinking: () => void
}) {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [showTimer, setShowTimer] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isWaiting) {
      const startTime = Date.now()
      interval = setInterval(() => {
        const diff = Date.now() - startTime
        setElapsedMs(diff)
        if (diff > 1000 && !showTimer) {
          setShowTimer(true)
        }
      }, 100)
    } else {
      setShowTimer(false)
      setElapsedMs(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isWaiting, showTimer])

  if (isWaiting && showTimer) {
    const totalSeconds = Math.floor(elapsedMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    return (
      <div className="flex items-center gap-1.5 rounded-devkit px-3 py-1.5 text-[11px] font-bold transition-all border h-[32px] bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_12px_rgba(168,158,249,0.15)] animate-pulse">
        <HugeiconsIcon icon={Brain01Icon} size={13} className="animate-bounce" />
        <span className="font-sans hidden sm:inline">Thinking</span>
        <span className="font-mono text-purple-400 bg-purple-500/20 border border-purple-500/30 px-1.5 py-0.5 rounded ml-1">
          {formattedTime}
        </span>
      </div>
    )
  }

  // Fallback to the original toggle
  return (
    <button
      type="button"
      onClick={onToggleThinking}
      className={`flex items-center gap-1.5 rounded-devkit px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer border h-[32px] ${
        isThinkingModeEnabled
          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_12px_rgba(168,158,249,0.15)] animate-pulse'
          : 'bg-devkit-bg border-devkit-bg-muted text-devkit-text-secondary hover:border-devkit-accent/40 hover:text-devkit-text'
      }`}
      title="Toggle Deep Thinking Mode"
    >
      <HugeiconsIcon icon={Brain01Icon} size={13} className={isThinkingModeEnabled ? "text-purple-400" : "opacity-70"} />
      <span className="hidden sm:inline">Thinking</span>
    </button>
  )
}

export function ChatInput() {
  const { state, dispatch, sendMessage, stopGeneration } = useChatStore()
  const { isGenerating } = state

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [parameterPopoverOpen, setParameterPopoverOpen] = useState(false)

  // Compute if we are waiting for the first token
  const activeConversationId = state.activeConversationId
  const activeMessages = activeConversationId
    ? state.conversations.find((c) => c.id === activeConversationId)?.messages || []
    : []
  const lastMessage = activeMessages[activeMessages.length - 1]
  const isWaitingForFirstToken = isGenerating && lastMessage?.role === 'user'

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
      className={cn(
        "relative flex flex-col justify-between w-full shadow-lg transition-all duration-300 z-20 border border-devkit-bg-muted bg-devkit-bg-subtle/85 backdrop-blur-md rounded-lg-devkit p-4 pb-3",
        isFocused 
          ? "border-devkit-accent/40 shadow-[0_0_20px_rgba(124,111,247,0.15)] bg-devkit-bg-subtle" 
          : "hover:border-devkit-accent/20"
      )}
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
          className="w-full resize-none bg-transparent outline-none text-[15px] leading-relaxed text-devkit-text placeholder-devkit-text-tertiary font-sans"
          style={{
            caretColor: 'var(--devkit-accent)',
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
            className="flex h-[32px] w-[32px] items-center justify-center rounded-devkit bg-devkit-bg border border-devkit-bg-muted text-devkit-text-secondary hover:border-devkit-accent/40 hover:text-devkit-text active:scale-90 transition-all cursor-pointer shadow-sm"
            title="Attach files"
          >
            <HugeiconsIcon icon={Add01Icon} size={16} />
          </button>
        </div>

        {/* Right Side: Config Cluster & Action Button */}
        <div className="flex items-center gap-2">
          
          {/* Model Selector dropdown pill */}
          <div className="relative flex items-center hidden sm:flex">
            <button
              type="button"
              onClick={() => setModelDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 rounded-devkit px-3 text-[11px] font-semibold bg-devkit-bg border border-devkit-bg-muted text-devkit-text hover:border-devkit-accent/40 active:scale-95 transition-all cursor-pointer h-[32px] shadow-sm"
            >
              <span className="text-xs leading-none">
                {providerEmojis[state.selectedModel.provider] || '🤖'}
              </span>
              <span className="max-w-[100px] truncate">{state.selectedModel.name}</span>
              <HugeiconsIcon icon={ChevronDownIcon} size={11} className="opacity-60 ml-0.5" />
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

          {/* Thinking Timer / Toggle */}
          <ThinkingTimer
            isWaiting={isWaitingForFirstToken}
            isThinkingModeEnabled={state.enable_thinking}
            onToggleThinking={() => dispatch({ type: 'SET_THINKING', payload: !state.enable_thinking })}
          />

          {/* Inference Settings Gear & Popover */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setParameterPopoverOpen(prev => !prev)}
              className={cn(
                "flex h-[32px] w-[32px] items-center justify-center rounded-devkit transition-all cursor-pointer border shadow-sm",
                parameterPopoverOpen 
                  ? "bg-devkit-accent border-devkit-accent text-white" 
                  : "bg-devkit-bg border-devkit-bg-muted text-devkit-text-secondary hover:border-devkit-accent/40 hover:text-devkit-text"
              )}
              title="Inference Settings"
            >
              <HugeiconsIcon icon={Settings02Icon} size={14} className={parameterPopoverOpen ? 'rotate-90 transition-transform duration-300' : 'transition-transform duration-300'} />
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
              className="flex h-[32px] w-[32px] items-center justify-center rounded-devkit transition-all duration-200 shadow-md cursor-pointer bg-devkit-coral hover:bg-devkit-coral/90 text-white active:scale-90"
              title="Stop generating"
            >
              <HugeiconsIcon icon={StopIcon} size={14} />
            </button>
          ) : hasText ? (
            <button
              type="button"
              onClick={handleSend}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-devkit transition-all duration-200 shadow-md cursor-pointer bg-devkit-accent hover:bg-[#8d82f8] text-white active:scale-90 animate-cta-shimmer"
              title="Send message"
            >
              <HugeiconsIcon icon={ArrowUp01Icon} size={14} className="stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              className="flex h-[32px] w-[32px] items-center justify-center rounded-devkit transition-all duration-200 shadow-sm cursor-pointer bg-devkit-bg border border-devkit-bg-muted text-devkit-text-secondary hover:border-devkit-accent/40 hover:text-devkit-text active:scale-90"
              title="Voice input"
            >
              <HugeiconsIcon icon={Mic01Icon} size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
