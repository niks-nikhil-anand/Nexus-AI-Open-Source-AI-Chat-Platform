'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Search, Pin, Settings, Sun, Moon, PanelLeft } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { groupConversationsByDate } from '@/lib/group-conversations'
import { ConversationItem } from './ConversationItem'

export function LeftSidebar() {
  const { state, dispatch } = useChatStore()
  const { conversations, activeConversationId, theme } = state
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const pinnedConversations = conversations.filter((c) => c.isPinned)
  const unpinnedConversations = conversations.filter((c) => !c.isPinned)
  const groupedConversations = groupConversationsByDate(unpinnedConversations)

  return (
    <div className="flex h-full w-[260px] flex-col bg-[var(--nc-surface-1)]">
      {/* Header: Logo + Collapse Toggle */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Image
            src="/logo2.png"
            alt="NeuraChat Logo"
            width={30}
            height={30}
            className="object-contain"
          />
          <span className="text-sm font-semibold text-[var(--nc-text-primary)]">
            NeuraChat
          </span>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_LEFT_SIDEBAR' })}
          className="rounded p-1 text-[var(--nc-text-muted)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-colors"
          aria-label="Collapse sidebar"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-1 px-3 pb-2">
        <button
          onClick={() => dispatch({ type: 'NEW_CONVERSATION' })}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--nc-text-primary)] hover:bg-[var(--nc-accent)] hover:text-white transition-colors"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })}
          className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-[var(--nc-text-secondary)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Search size={16} />
            <span>Search</span>
          </span>
          <kbd className="text-[10px] text-[var(--nc-text-muted)] bg-[var(--nc-surface-3)] rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3">
        {/* Pinned Section */}
        {pinnedConversations.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 px-2 py-1.5">
              <Pin size={10} className="text-[var(--nc-text-muted)]" />
              <span
                className="text-[10px] uppercase text-[var(--nc-text-muted)] font-medium"
                style={{ letterSpacing: '0.08em' }}
              >
                Pinned
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {pinnedConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => dispatch({ type: 'SELECT_CONVERSATION', payload: { id: conv.id } })}
                  onPin={() => dispatch({ type: 'PIN_CONVERSATION', payload: { id: conv.id } })}
                  onDelete={() => dispatch({ type: 'DELETE_CONVERSATION', payload: { id: conv.id } })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent (grouped by date) */}
        {groupedConversations.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="px-2 py-1.5">
              <span
                className="text-[10px] uppercase text-[var(--nc-text-muted)] font-medium"
                style={{ letterSpacing: '0.08em' }}
              >
                {group.label}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => dispatch({ type: 'SELECT_CONVERSATION', payload: { id: conv.id } })}
                  onPin={() => dispatch({ type: 'PIN_CONVERSATION', payload: { id: conv.id } })}
                  onDelete={() => dispatch({ type: 'DELETE_CONVERSATION', payload: { id: conv.id } })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--nc-border)] mt-auto flex flex-col">
        {/* Settings & Theme toggles split row */}
        <div className="flex items-center justify-between px-3 py-2 gap-1 border-b border-[var(--nc-border)] bg-[var(--nc-surface-1)]">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-[var(--nc-text-secondary)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-colors"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
          <div className="h-4 w-px bg-[var(--nc-border)]" />
          <button
            onClick={() =>
              dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' })
            }
            className="flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-[var(--nc-text-secondary)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-colors"
          >
            {!mounted || theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>Theme</span>
          </button>
        </div>

        {/* User info section */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 bg-[var(--nc-surface-2)]/30">
          <div className="h-7 w-7 rounded-full bg-[var(--nc-accent)] flex items-center justify-center text-[11px] text-white font-bold select-none">
            U
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[var(--nc-text-primary)] leading-none truncate">User Account</span>
            <span className="text-[10px] text-[var(--nc-text-secondary)] leading-none mt-1 truncate">user@neurachat.ai</span>
          </div>
        </div>
      </div>
    </div>
  )
}
