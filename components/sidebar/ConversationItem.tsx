'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { PinIcon, Delete02Icon } from '@hugeicons/core-free-icons'
import type { Conversation } from '@/lib/types'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: () => void
  onPin: () => void
  onDelete: () => void
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onPin,
  onDelete,
}: ConversationItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        group relative flex w-full items-center rounded-devkit px-3 py-2 text-left text-sm
        transition-all duration-200 cursor-pointer
        ${
          isActive
            ? 'bg-devkit-accent/10 text-devkit-accent border-l-2 border-devkit-accent font-medium'
            : 'bg-transparent text-devkit-text-secondary hover:bg-devkit-bg-muted/60 hover:text-devkit-text'
        }
      `}
    >
      <span className="truncate flex-1 pr-2">
        {conversation.title}
      </span>

      {/* Action icons: visible on hover */}
      <span className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-2 shrink-0">
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onPin()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              onPin()
            }
          }}
          className="p-1 rounded-devkit hover:bg-devkit-bg-muted text-devkit-text-tertiary hover:text-devkit-text transition-colors"
          title={conversation.isPinned ? "Unpin chat" : "Pin chat"}
        >
          <HugeiconsIcon icon={PinIcon} size={14} className={conversation.isPinned ? "text-devkit-accent" : ""} />
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              onDelete()
            }
          }}
          className="p-1 rounded-devkit hover:bg-devkit-bg-muted text-devkit-text-tertiary hover:text-devkit-coral transition-colors"
          title="Delete chat"
        >
          <HugeiconsIcon icon={Delete02Icon} size={14} />
        </span>
      </span>
    </button>
  )
}

