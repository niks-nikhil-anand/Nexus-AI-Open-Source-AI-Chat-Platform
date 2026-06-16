'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronDownIcon, InformationCircleIcon } from '@hugeicons/core-free-icons'
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
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b px-4 relative bg-devkit-bg border-devkit-bg-muted transition-colors duration-300">
      {/* Left: Model selector trigger + Info button */}
      <div className="flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={handleModelClick}
          className="flex items-center gap-2 rounded-devkit border border-devkit-bg-muted bg-devkit-bg-subtle px-3 py-1.5 text-xs font-semibold text-devkit-text hover:border-devkit-accent/40 transition-all duration-200 cursor-pointer"
          aria-label={`Current model: ${selectedModel.name}. Click to change model.`}
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: selectedModel.providerColor || 'var(--devkit-accent)' }}
            aria-hidden="true"
          />
          <span>{selectedModel.name}</span>
          <HugeiconsIcon icon={ChevronDownIcon} size={14} className="opacity-60" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handlePanelToggle}
          className={cn(
            'flex items-center justify-center rounded-devkit border p-1.5 transition-all duration-300 cursor-pointer h-7.5 w-7.5',
            rightPanelOpen
              ? 'bg-devkit-accent border-devkit-accent text-white shadow-sm'
              : 'bg-devkit-bg-subtle border-devkit-bg-muted text-devkit-text-secondary hover:text-devkit-text hover:border-devkit-accent/40'
          )}
          aria-label={rightPanelOpen ? 'Close model details' : 'Open model details'}
          aria-pressed={rightPanelOpen}
          title="Model details"
        >
          <HugeiconsIcon icon={InformationCircleIcon} size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Center: Conversation title */}
      <span
        className="absolute left-1/2 -translate-x-1/2 truncate text-xs sm:text-sm font-display font-medium max-w-[40%] text-center pointer-events-none text-devkit-text-secondary"
        title={conversationTitle}
      >
        {conversationTitle}
      </span>

      {/* Right: Balance offset spacer */}
      <div className="w-8 h-8 pointer-events-none" />
    </header>
  )
}
