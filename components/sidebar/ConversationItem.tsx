'use client'

import { Pin, Trash2 } from 'lucide-react'
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
        group relative flex w-full items-center rounded-[6px] px-3 py-2 text-left text-sm
        transition-colors duration-150
        ${
          isActive
            ? 'bg-[var(--nc-accent-dim)] text-[var(--nc-text-primary)] border-l-2 border-[var(--nc-accent)]'
            : 'bg-transparent text-[var(--nc-text-secondary)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)]'
        }
      `}
    >
      <span className="truncate flex-1">{conversation.title}</span>

      {/* Action icons: visible on hover */}
      <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-2 shrink-0">
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
          className="p-0.5 rounded hover:bg-[var(--nc-surface-2)] text-[var(--nc-text-muted)] hover:text-[var(--nc-text-primary)]"
        >
          <Pin size={14} />
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
          className="p-0.5 rounded hover:bg-[var(--nc-surface-2)] text-[var(--nc-text-muted)] hover:text-[var(--nc-error)]"
        >
          <Trash2 size={14} />
        </span>
      </span>
    </button>
  )
}
