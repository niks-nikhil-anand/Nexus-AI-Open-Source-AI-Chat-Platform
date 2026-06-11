'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Search, Pin, Settings, Sun, Moon, PanelLeft } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { groupConversationsByDate } from '@/lib/group-conversations'
import { ConversationItem } from './ConversationItem'

export function LeftSidebar() {
  const { state, dispatch } = useChatStore()
  const { conversations, activeConversationId, theme, leftSidebarOpen } = state
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const pinnedConversations = conversations.filter((c) => c.isPinned)
  const unpinnedConversations = conversations.filter((c) => !c.isPinned)
  const groupedConversations = groupConversationsByDate(unpinnedConversations)

  if (!leftSidebarOpen) {
    return (
      <div className="flex h-full w-full flex-col items-center py-4 bg-[var(--nc-surface-1)] border-r border-[var(--nc-border)]">
        {/* Top: Toggle Sidebar */}
        <div className="mb-6">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_LEFT_SIDEBAR' })}
            className="rounded-lg p-2 text-[var(--nc-text-muted)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-colors cursor-pointer"
            aria-label="Expand sidebar"
          >
            <PanelLeft size={20} />
          </button>
        </div>

        {/* Quick Action Icons */}
        <div className="flex flex-col gap-4 items-center">
          {/* New Chat */}
          <button
            onClick={() => dispatch({ type: 'NEW_CONVERSATION' })}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-white bg-[var(--nc-accent)] hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer animate-none"
            style={{ boxShadow: 'var(--nc-accent-glow)' }}
            aria-label="New Chat"
          >
            <Plus size={20} strokeWidth={2.5} />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-[var(--nc-surface-3)] text-[10px] text-[var(--nc-text-primary)] px-2 py-1 rounded border border-[var(--nc-border)] whitespace-nowrap shadow-lg z-50">
              New Chat
            </div>
          </button>

          {/* Search */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })}
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl text-[var(--nc-text-secondary)] bg-[var(--nc-surface-2)] border border-[var(--nc-border)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-all active:scale-95 cursor-pointer"
            aria-label="Search"
          >
            <Search size={18} />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-[var(--nc-surface-3)] text-[10px] text-[var(--nc-text-primary)] px-2 py-1 rounded border border-[var(--nc-border)] whitespace-nowrap shadow-lg z-50">
              Search (⌘K)
            </div>
          </button>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col items-center">
          {/* User Profile Avatar */}
          <div className="relative group/avatar cursor-pointer mb-5">
            <div className="h-9 w-9 rounded-full bg-[var(--nc-accent)] flex items-center justify-center text-xs text-white font-bold select-none">
              U
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-[var(--nc-success)] border-2 border-[var(--nc-surface-1)] animate-pulse" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/avatar:opacity-100 transition-opacity bg-[var(--nc-surface-3)] text-[10px] text-[var(--nc-text-primary)] px-2 py-1 rounded border border-[var(--nc-border)] whitespace-nowrap shadow-lg z-50">
              user@neurachat.ai
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
            className="group relative rounded-lg p-2 text-[var(--nc-text-secondary)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-all cursor-pointer mb-2"
            aria-label="Settings"
          >
            <Settings size={18} />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-[var(--nc-surface-3)] text-[10px] text-[var(--nc-text-primary)] px-2 py-1 rounded border border-[var(--nc-border)] whitespace-nowrap shadow-lg z-50">
              Settings
            </div>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() =>
              dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' })
            }
            className="group relative rounded-lg p-2 text-[var(--nc-text-secondary)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {!mounted || theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-[var(--nc-surface-3)] text-[10px] text-[var(--nc-text-primary)] px-2 py-1 rounded border border-[var(--nc-border)] whitespace-nowrap shadow-lg z-50">
              Toggle Theme
            </div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-[var(--nc-surface-1)]">
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
      <div className="flex flex-col gap-2 px-3 pb-3">
        <button
          onClick={() => dispatch({ type: 'NEW_CONVERSATION' })}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-[var(--nc-accent)] hover:opacity-90 transition-all shadow-md active:scale-98 cursor-pointer"
          style={{ boxShadow: 'var(--nc-accent-glow)' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Chat</span>
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })}
          className="flex items-center justify-between rounded-xl px-4 py-2 text-sm text-[var(--nc-text-secondary)] bg-[var(--nc-surface-2)] border border-[var(--nc-border)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search size={15} />
            <span>Search...</span>
          </span>
          <kbd className="text-[10px] text-[var(--nc-text-muted)] bg-[var(--nc-surface-3)] rounded px-1.5 py-0.5 border border-[var(--nc-border)]">
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
      <div className="mt-auto p-4 flex flex-col gap-3 border-t border-[var(--nc-border)] bg-[var(--nc-surface-1)]">
        {/* User profile card widget */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--nc-surface-2)] border border-[var(--nc-border)] shadow-sm hover:border-[var(--nc-accent)]/30 transition-all">
          <div className="relative flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-[var(--nc-accent)] flex items-center justify-center text-xs text-white font-bold select-none">
              U
            </div>
            {/* Active status indicator dot */}
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-[var(--nc-success)] border-2 border-[var(--nc-surface-2)] animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[var(--nc-text-primary)] leading-none truncate">User Account</span>
            <span className="text-[10px] text-[var(--nc-text-secondary)] leading-none mt-1.5 truncate">user@neurachat.ai</span>
          </div>
        </div>

        {/* Settings & Theme toggles row */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-[var(--nc-text-secondary)] bg-[var(--nc-surface-2)] border border-[var(--nc-border)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-all cursor-pointer"
          >
            <Settings size={13} />
            <span>Settings</span>
          </button>
          <button
            onClick={() =>
              dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' })
            }
            className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-[var(--nc-text-secondary)] bg-[var(--nc-surface-2)] border border-[var(--nc-border)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-all cursor-pointer"
          >
            {!mounted || theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            <span>Theme</span>
          </button>
        </div>
      </div>
    </div>
  )
}
