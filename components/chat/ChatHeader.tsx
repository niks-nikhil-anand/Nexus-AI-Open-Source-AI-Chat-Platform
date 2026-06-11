'use client'

import { ChevronDown, PanelRight } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface ChatHeaderProps {
  onModelSelectorOpen?: () => void
}

export function ChatHeader({ onModelSelectorOpen }: ChatHeaderProps) {
  const { state, dispatch, activeConversation } = useChatStore()
  const { selectedModel, rightPanelOpen } = state

  const conversationTitle = activeConversation?.title ?? 'New Conversation'

  function handleModelClick() {
    onModelSelectorOpen?.()
  }

  function handlePanelToggle() {
    dispatch({ type: 'TOGGLE_RIGHT_PANEL' })
  }

  return (
    <header
      className="flex h-[52px] shrink-0 items-center justify-between border-b px-4"
      style={{
        backgroundColor: 'var(--nc-surface-1)',
        borderColor: 'var(--nc-border)',
      }}
    >
      {/* Left: Model selector trigger */}
      <button
        type="button"
        onClick={handleModelClick}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--nc-surface-3)]"
        style={{ color: 'var(--nc-text-primary)' }}
        aria-label={`Current model: ${selectedModel.name}. Click to change model.`}
      >
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: selectedModel.providerColor }}
          aria-hidden="true"
        />
        <span>{selectedModel.name}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
      </button>

      {/* Center: Conversation title */}
      <span
        className="absolute left-1/2 -translate-x-1/2 truncate text-sm max-w-[40%]"
        style={{ color: 'var(--nc-text-secondary)' }}
        title={conversationTitle}
      >
        {conversationTitle}
      </span>

      {/* Right: Panel toggle */}
      <button
        type="button"
        onClick={handlePanelToggle}
        className={cn(
          'flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-[var(--nc-surface-3)]',
          rightPanelOpen && 'bg-[var(--nc-accent-dim)]'
        )}
        style={{ color: rightPanelOpen ? 'var(--nc-accent)' : 'var(--nc-text-secondary)' }}
        aria-label={rightPanelOpen ? 'Close model panel' : 'Open model panel'}
        aria-pressed={rightPanelOpen}
      >
        <PanelRight className="h-4.5 w-4.5" aria-hidden="true" />
      </button>
    </header>
  )
}
