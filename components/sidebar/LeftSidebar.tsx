'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  Search01Icon,
  PinIcon,
  Settings02Icon,
  Sun01Icon,
  Moon01Icon,
  SidebarLeftIcon
} from '@hugeicons/core-free-icons'
import { useChatStore } from '@/lib/store'
import { groupConversationsByDate } from '@/lib/group-conversations'
import { ConversationItem } from './ConversationItem'

export function LeftSidebar() {
  const { state, dispatch } = useChatStore()
  const { conversations, activeConversationId, theme, leftSidebarOpen } = state
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<{name: string, email: string} | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(console.error)
      
    return () => clearTimeout(timer)
  }, [])

  const pinnedConversations = conversations.filter((c) => c.isPinned)
  const unpinnedConversations = conversations.filter((c) => !c.isPinned)
  const groupedConversations = groupConversationsByDate(unpinnedConversations)

  if (!leftSidebarOpen) {
    return (
      <div className="flex h-full w-full flex-col items-center pt-8 pb-4 bg-devkit-bg-subtle border-r border-devkit-bg-muted transition-colors duration-300">
        {/* Top: Toggle Sidebar */}
        <div className="mb-8">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_LEFT_SIDEBAR' })}
            className="rounded-devkit p-2 text-devkit-text-secondary hover:bg-devkit-bg-muted hover:text-devkit-text transition-colors duration-200 cursor-pointer border border-transparent hover:border-devkit-bg-muted"
            aria-label="Expand sidebar"
          >
            <HugeiconsIcon icon={SidebarLeftIcon} size={18} />
          </button>
        </div>

        {/* Quick Action Icons */}
        <div className="flex flex-col gap-4 items-center">
          {/* New Chat */}
          <button
            onClick={() => dispatch({ type: 'NEW_CONVERSATION' })}
            className="group relative flex h-9 w-9 items-center justify-center rounded-devkit text-white bg-devkit-accent hover:bg-[#8d82f8] transition-all active:scale-95 cursor-pointer border border-devkit-accent/20 shadow-sm"
            aria-label="New Chat"
          >
            <HugeiconsIcon icon={Add01Icon} size={18} />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-devkit-bg text-[10px] text-devkit-text px-2 py-1 rounded-devkit border border-devkit-bg-muted whitespace-nowrap shadow-lg z-50 font-mono uppercase tracking-wider">
              New Chat
            </div>
          </button>

          {/* Search */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })}
            className="group relative flex h-9 w-9 items-center justify-center rounded-devkit text-devkit-text-secondary bg-devkit-bg border border-devkit-bg-muted hover:border-devkit-accent/40 hover:text-devkit-text transition-all active:scale-95 cursor-pointer shadow-sm"
            aria-label="Search"
          >
            <HugeiconsIcon icon={Search01Icon} size={16} />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-devkit-bg text-[10px] text-devkit-text px-2 py-1 rounded-devkit border border-devkit-bg-muted whitespace-nowrap shadow-lg z-50 font-mono uppercase tracking-wider">
              Search (⌘K)
            </div>
          </button>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col items-center">
          {/* User Profile Avatar */}
          <div className="relative group/avatar cursor-pointer mb-5">
            <div className="h-9 w-9 rounded-full bg-devkit-accent flex items-center justify-center text-xs text-white font-bold select-none uppercase shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-devkit-teal border-2 border-devkit-bg-subtle animate-pulse" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/avatar:opacity-100 transition-opacity bg-devkit-bg text-[10px] text-devkit-text px-2 py-1 rounded-devkit border border-devkit-bg-muted whitespace-nowrap shadow-lg z-50 font-mono">
              {user?.email || 'user@neurachat.ai'}
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
            className="group relative rounded-devkit p-2 text-devkit-text-secondary hover:bg-devkit-bg border border-transparent hover:border-devkit-bg-muted hover:text-devkit-text transition-all duration-300 cursor-pointer mb-2"
            aria-label="Settings"
          >
            <HugeiconsIcon icon={Settings02Icon} size={18} />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-devkit-bg text-[10px] text-devkit-text px-2 py-1 rounded-devkit border border-devkit-bg-muted whitespace-nowrap shadow-lg z-50 font-mono uppercase tracking-wider">
              Settings
            </div>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() =>
              dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' })
            }
            className="group relative rounded-devkit p-2 text-devkit-text-secondary hover:bg-devkit-bg border border-transparent hover:border-devkit-bg-muted hover:text-devkit-text transition-all duration-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {!mounted || theme === 'dark' ? <HugeiconsIcon icon={Sun01Icon} size={18} /> : <HugeiconsIcon icon={Moon01Icon} size={18} />}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-devkit-bg text-[10px] text-devkit-text px-2 py-1 rounded-devkit border border-devkit-bg-muted whitespace-nowrap shadow-lg z-50 font-mono uppercase tracking-wider">
              Toggle Theme
            </div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-devkit-bg-subtle border-r border-devkit-bg-muted transition-colors duration-300">
      {/* Header: Logo + Collapse Toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-devkit-bg-muted">
        <div className="flex items-center gap-2">
          <div className="relative w-[28px] h-[28px] shrink-0">
            <Image
              src="/logo2.png"
              alt="NeuraChat Logo"
              fill
              sizes="28px"
              className="object-contain rounded-md"
            />
          </div>
          <span className="font-display text-sm font-normal tracking-tight text-devkit-text">
            NeuraChat
          </span>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_LEFT_SIDEBAR' })}
          className="rounded-devkit p-1.5 text-devkit-text-secondary hover:bg-devkit-bg-muted hover:text-devkit-text transition-colors duration-200 cursor-pointer"
          aria-label="Collapse sidebar"
        >
          <HugeiconsIcon icon={SidebarLeftIcon} size={16} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-[18px] px-3 pt-4 pb-3">
        <button
          onClick={() => dispatch({ type: 'NEW_CONVERSATION' })}
          className="flex items-center justify-center gap-2 rounded-devkit px-4 py-2 text-sm font-semibold text-white bg-devkit-accent hover:bg-[#8d82f8] transition-all active:scale-98 shadow-sm cursor-pointer border border-devkit-accent/20"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} />
          <span>New Chat</span>
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })}
          className="flex items-center justify-between rounded-devkit px-4 py-2 text-sm text-devkit-text-secondary bg-devkit-bg border border-devkit-bg-muted hover:border-devkit-accent/40 hover:text-devkit-text transition-all cursor-pointer shadow-sm"
        >
          <span className="flex items-center gap-2">
            <HugeiconsIcon icon={Search01Icon} size={15} />
            <span>Search...</span>
          </span>
          <kbd className="text-[10px] text-devkit-text-tertiary bg-devkit-bg-muted rounded px-1.5 py-0.5 border border-devkit-bg-muted font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        {/* Pinned Section */}
        {pinnedConversations.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 px-2 py-1.5">
              <HugeiconsIcon icon={PinIcon} size={10} className="text-devkit-text-tertiary animate-none" />
              <span
                className="text-[10px] uppercase text-devkit-text-tertiary font-mono font-bold tracking-wider"
              >
                Pinned
              </span>
            </div>
            <div className="flex flex-col gap-1">
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
                className="text-[10px] uppercase text-devkit-text-tertiary font-mono font-bold tracking-wider"
              >
                {group.label}
              </span>
            </div>
            <div className="flex flex-col gap-1">
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
      <div className="mt-auto p-4 flex flex-col gap-3 border-t border-devkit-bg-muted bg-devkit-bg-subtle transition-colors duration-300">
        {/* User profile card widget */}
        <div className="flex items-center gap-3 p-3 rounded-lg-devkit bg-devkit-bg border border-devkit-bg-muted shadow-sm hover:border-devkit-accent/30 transition-all duration-300 group/profile">
          <div className="relative flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-devkit-accent flex items-center justify-center text-xs text-white font-bold select-none uppercase shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {/* Active status indicator dot - DevKit Teal */}
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-devkit-teal border-2 border-devkit-bg animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-devkit-text leading-none truncate group-hover/profile:text-devkit-accent transition-colors">{user?.name || 'User Account'}</span>
            <span className="text-[10px] text-devkit-text-secondary leading-none mt-1.5 truncate">{user?.email || 'user@neurachat.ai'}</span>
          </div>
        </div>

        {/* Settings & Theme toggles row */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
            className="flex-1 flex items-center justify-center gap-2 rounded-devkit py-2 text-xs font-medium text-devkit-text-secondary bg-devkit-bg shadow-sm border border-devkit-bg-muted hover:border-devkit-accent hover:text-devkit-text transition-all duration-300 cursor-pointer"
          >
            <HugeiconsIcon icon={Settings02Icon} size={13} />
            <span>Settings</span>
          </button>
          <button
            onClick={() =>
              dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' })
            }
            className="flex-1 flex items-center justify-center gap-2 rounded-devkit py-2 text-xs font-medium text-devkit-text-secondary bg-devkit-bg shadow-sm border border-devkit-bg-muted hover:border-devkit-accent hover:text-devkit-text transition-all duration-300 cursor-pointer"
          >
            {!mounted || theme === 'dark' ? <HugeiconsIcon icon={Sun01Icon} size={13} /> : <HugeiconsIcon icon={Moon01Icon} size={13} />}
            <span>Theme</span>
          </button>
        </div>
      </div>
    </div>
  )
}
