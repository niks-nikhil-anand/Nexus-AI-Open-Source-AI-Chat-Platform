'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Sun, Moon, Settings, MessageSquare, Cpu } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { mockModels } from '@/lib/mock-data'
import { paletteVariants, springs } from '@/lib/animations'
import type { AIModel } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaletteItem {
  id: string
  label: string
  section: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CommandPalette() {
  const { state, dispatch } = useChatStore()
  const { commandPaletteOpen, conversations, theme } = state

  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })
  }, [dispatch])

  // ─── Build items ──────────────────────────────────────────────────────

  const allItems = useMemo((): PaletteItem[] => {
    const items: PaletteItem[] = []

    // Recent Conversations (first 5)
    const recentConversations = conversations.slice(0, 5)
    recentConversations.forEach((conv) => {
      items.push({
        id: `conv-${conv.id}`,
        label: conv.title,
        section: 'Recent Conversations',
        icon: <MessageSquare size={16} />,
        action: () => {
          dispatch({ type: 'SELECT_CONVERSATION', payload: { id: conv.id } })
          close()
        },
      })
    })

    // Quick Actions
    items.push({
      id: 'action-new-chat',
      label: 'New Chat',
      section: 'Actions',
      icon: <Plus size={16} />,
      shortcut: '⌘N',
      action: () => {
        dispatch({ type: 'NEW_CONVERSATION' })
        close()
      },
    })

    items.push({
      id: 'action-toggle-theme',
      label: theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      section: 'Actions',
      icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
      action: () => {
        dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' })
        close()
      },
    })

    items.push({
      id: 'action-settings',
      label: 'Open Settings',
      section: 'Actions',
      icon: <Settings size={16} />,
      action: () => {
        dispatch({ type: 'TOGGLE_SETTINGS' })
        close()
      },
    })

    // Models
    mockModels.forEach((model: AIModel) => {
      items.push({
        id: `model-${model.id}`,
        label: `Switch to ${model.name}`,
        section: 'Models',
        icon: <Cpu size={16} />,
        action: () => {
          dispatch({ type: 'SET_MODEL', payload: model })
          close()
        },
      })
    })

    return items
  }, [conversations, theme, dispatch, close])

  // ─── Filtering ────────────────────────────────────────────────────────

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems
    const lower = query.toLowerCase()
    return allItems.filter((item) => item.label.toLowerCase().includes(lower))
  }, [allItems, query])

  // ─── Grouped sections for rendering ───────────────────────────────────

  const sections = useMemo(() => {
    const sectionMap = new Map<string, PaletteItem[]>()
    filteredItems.forEach((item) => {
      const existing = sectionMap.get(item.section) || []
      existing.push(item)
      sectionMap.set(item.section, existing)
    })
    return Array.from(sectionMap.entries())
  }, [filteredItems])

  // ─── Reset state when opening ─────────────────────────────────────────

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setHighlightedIndex(0)
      // Focus with a short delay to allow animation
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  // ─── Reset highlighted index when filter changes ──────────────────────

  useEffect(() => {
    setHighlightedIndex(0)
  }, [query])

  // ─── Keyboard navigation ──────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          )
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          )
          break
        }
        case 'Enter': {
          e.preventDefault()
          const item = filteredItems[highlightedIndex]
          if (item) item.action()
          break
        }
        case 'Escape': {
          e.preventDefault()
          close()
          break
        }
      }
    },
    [filteredItems, highlightedIndex, close]
  )

  // ─── Scroll highlighted item into view ────────────────────────────────

  useEffect(() => {
    if (!listRef.current) return
    const highlighted = listRef.current.querySelector('[data-highlighted="true"]')
    if (highlighted) {
      highlighted.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  // ─── Render ───────────────────────────────────────────────────────────

  // Track flattened index for highlight
  let flatIndex = -1

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={paletteVariants}
            transition={springs.popup}
            onKeyDown={handleKeyDown}
          >
            <div
              className="w-full max-w-[560px] bg-[var(--nc-surface-1)]/95 backdrop-blur-xl border border-[var(--nc-border)] shadow-xl rounded-xl overflow-hidden"
              role="dialog"
              aria-label="Command Palette"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--nc-border)]">
                <Search size={18} className="text-[var(--nc-text-muted)] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-[var(--nc-text-primary)] placeholder:text-[var(--nc-text-muted)] outline-none"
                  autoComplete="off"
                  spellCheck={false}
                />
                <kbd className="text-[10px] text-[var(--nc-text-muted)] bg-[var(--nc-surface-3)] rounded px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>

              {/* Items */}
              <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2">
                {sections.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-[var(--nc-text-muted)]">
                    No results found
                  </div>
                )}

                {sections.map(([sectionName, items]) => (
                  <div key={sectionName} className="mb-1">
                    {/* Section header */}
                    <div className="px-4 py-1.5">
                      <span
                        className="text-[10px] uppercase text-[var(--nc-text-muted)] font-medium"
                        style={{ letterSpacing: '0.08em' }}
                      >
                        {sectionName}
                      </span>
                    </div>

                    {/* Section items */}
                    {items.map((item) => {
                      flatIndex++
                      const currentIndex = flatIndex
                      const isHighlighted = currentIndex === highlightedIndex

                      return (
                        <button
                          key={item.id}
                          data-highlighted={isHighlighted}
                          onClick={item.action}
                          onMouseEnter={() => setHighlightedIndex(currentIndex)}
                          className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
                            isHighlighted
                              ? 'bg-[var(--nc-accent)] text-white'
                              : 'text-[var(--nc-text-primary)] hover:bg-[var(--nc-surface-3)]'
                          }`}
                        >
                          <span
                            className={
                              isHighlighted
                                ? 'text-white/80'
                                : 'text-[var(--nc-text-muted)]'
                            }
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1 text-left truncate">
                            {item.label}
                          </span>
                          {item.shortcut && (
                            <kbd
                              className={`text-[10px] rounded px-1.5 py-0.5 ${
                                isHighlighted
                                  ? 'bg-white/20 text-white/80'
                                  : 'bg-[var(--nc-surface-3)] text-[var(--nc-text-muted)]'
                              }`}
                            >
                              {item.shortcut}
                            </kbd>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
