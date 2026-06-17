'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon, Sun01Icon, Moon01Icon, Download01Icon, Delete02Icon, KeyboardIcon } from '@hugeicons/core-free-icons'
import { useChatStore } from '@/lib/store'
import { aiModels } from '@/lib/ai-models'
import { springs } from '@/lib/animations'
import { cn } from '@/lib/utils'

const SHORTCUTS = [
  { keys: '⌘K', description: 'Command Palette' },
  { keys: '⌘N', description: 'New Chat' },
  { keys: 'Esc', description: 'Close overlay' },
  { keys: 'Enter', description: 'Send message' },
  { keys: 'Shift+Enter', description: 'New line' },
]

export function SettingsPanel() {
  const { state, dispatch } = useChatStore()
  const { settingsOpen, theme, selectedModel, conversations } = state
  const { data: session } = useSession()
  const user = session?.user

  const handleClose = useCallback(() => {
    dispatch({ type: 'TOGGLE_SETTINGS' })
  }, [dispatch])

  // Close on Escape key
  useEffect(() => {
    if (!settingsOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [settingsOpen, handleClose])

  function handleThemeChange(newTheme: 'dark' | 'light') {
    dispatch({ type: 'SET_THEME', payload: newTheme })
  }

  function handleModelSelect(model: typeof selectedModel) {
    dispatch({ type: 'SET_MODEL', payload: model })
  }

  function handleExportConversations() {
    const data = JSON.stringify(conversations, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nexusai-conversations.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClearAll() {
    conversations.forEach((conv) => {
      dispatch({ type: 'DELETE_CONVERSATION', payload: { id: conv.id } })
    })
  }

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-[400px] max-w-[90vw] z-50 flex flex-col overflow-hidden border-l border-devkit-bg-muted bg-devkit-bg/95 backdrop-blur-md shadow-2xl"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={springs.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
          >
            {/* Header */}
            <div className="flex h-[56px] shrink-0 items-center justify-between border-b border-devkit-bg-muted bg-devkit-bg-subtle/50 px-5">
              <h2 className="text-sm font-bold tracking-tight text-devkit-text font-sans">
                Settings
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center justify-center rounded-devkit border border-devkit-bg-muted bg-devkit-bg text-devkit-text-secondary hover:text-devkit-text hover:border-devkit-accent/40 p-1.5 transition-all cursor-pointer h-7.5 w-7.5"
                aria-label="Close settings"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={15} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar">
              {/* Account Section */}
              {user && (
                <>
                  <section>
                    <SectionHeader icon={<span className="h-4 w-4 text-center text-xs">👤</span>} title="Account" />
                    <div className="mt-3 bg-devkit-bg-subtle/50 border border-devkit-bg-muted/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {user.image ? (
                            <img src={user.image} alt={user.name || "Avatar"} className="h-12 w-12 rounded-full border border-devkit-accent object-cover" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-devkit-accent flex items-center justify-center text-sm text-white font-bold select-none uppercase shadow-inner">
                              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </div>
                          )}
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-devkit-teal border-2 border-devkit-bg-subtle" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-devkit-text truncate leading-tight">{user.name || 'User Account'}</span>
                          <span className="text-xs text-devkit-text-secondary truncate mt-1">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </section>
                  <Divider />
                </>
              )}

              {/* Appearance Section */}
              <section>
                <SectionHeader icon={<HugeiconsIcon icon={Sun01Icon} size={14} />} title="Appearance" />
                <div className="mt-3 space-y-4">
                  {/* Theme toggle */}
                  <div>
                    <label className="text-xs font-semibold text-devkit-text-secondary mb-2 block">
                      Theme
                    </label>
                    <div className="flex gap-2">
                      <ThemeButton
                        active={theme === 'dark'}
                        onClick={() => handleThemeChange('dark')}
                        icon={<HugeiconsIcon icon={Moon01Icon} size={14} />}
                        label="Dark"
                      />
                      <ThemeButton
                        active={theme === 'light'}
                        onClick={() => handleThemeChange('light')}
                        icon={<HugeiconsIcon icon={Sun01Icon} size={14} />}
                        label="Light"
                      />
                    </div>
                  </div>

                  {/* Font size slider (visual only) */}
                  <div>
                    <label className="text-xs font-semibold text-devkit-text-secondary mb-2 block">
                      Font Size
                    </label>
                    <input
                      type="range"
                      min={12}
                      max={20}
                      defaultValue={14}
                      className="w-full h-1.5 bg-devkit-bg-muted rounded-lg appearance-none cursor-pointer accent-devkit-accent focus:outline-none"
                      aria-label="Font size"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-devkit-text-tertiary mt-1.5">
                      <span>12px</span>
                      <span>14px</span>
                      <span>20px</span>
                    </div>
                  </div>
                </div>
              </section>



              {/* Chat Section */}
              <section>
                <SectionHeader icon={<span className="h-4 w-4 text-center text-xs">💬</span>} title="Chat" />
                <div className="mt-3 space-y-4">
                  <ToggleRow label="Auto-title conversations" defaultChecked />
                  <div className="flex items-center justify-between border-t border-devkit-bg-muted/30 pt-3">
                    <label className="text-xs font-semibold text-devkit-text-secondary">
                      Streaming Speed
                    </label>
                    <span className="text-xs font-bold text-devkit-text bg-devkit-bg-subtle px-2 py-1 rounded-devkit border border-devkit-bg-muted font-mono">
                      Normal
                    </span>
                  </div>
                </div>
              </section>

              <Divider />

              {/* Shortcuts Section */}
              <section>
                <SectionHeader icon={<HugeiconsIcon icon={KeyboardIcon} size={14} />} title="Shortcuts" />
                <div className="mt-3">
                  <table className="w-full text-xs font-sans">
                    <tbody>
                      {SHORTCUTS.map((shortcut) => (
                        <tr key={shortcut.keys} className="border-b border-devkit-bg-muted/50 last:border-0">
                          <td className="py-2.5 text-devkit-text-secondary font-medium">
                            {shortcut.description}
                          </td>
                          <td className="py-2.5 text-right">
                            <kbd className="inline-block rounded-devkit bg-devkit-bg-subtle border border-devkit-bg-muted px-2 py-0.5 text-[10px] font-mono font-bold text-devkit-text shadow-sm">
                              {shortcut.keys}
                            </kbd>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <Divider />

              {/* Data Section */}
              <section>
                <SectionHeader icon={<HugeiconsIcon icon={Download01Icon} size={14} />} title="Data" />
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={handleExportConversations}
                    className="flex w-full items-center justify-center gap-2 rounded-devkit px-4 py-2.5 text-xs font-semibold text-devkit-text bg-devkit-bg border border-devkit-bg-muted hover:border-devkit-accent/40 hover:text-devkit-text transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    <HugeiconsIcon icon={Download01Icon} size={14} className="text-devkit-accent" />
                    Export Conversations
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex w-full items-center justify-center gap-2 rounded-devkit px-4 py-2.5 text-xs font-semibold text-white bg-devkit-coral hover:bg-devkit-coral/95 transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                    Clear All Conversations
                  </button>
                </div>
              </section>

              <Divider />

              {/* About Section */}
              <section>
                <SectionHeader icon={<span className="h-4 w-4 text-center text-xs">ℹ️</span>} title="About" />
                <div className="mt-3 space-y-1 font-sans">
                  <p className="text-sm font-bold text-devkit-text font-display">
                    Nexus AI v0.1.0
                  </p>
                  <p className="text-xs text-devkit-text-secondary">
                    Built with Next.js, React, Framer Motion
                  </p>
                </div>
              </section>

              {user && (
                <>
                  <Divider />
                  <section>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center justify-center gap-2 rounded-devkit px-4 py-2.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </section>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 font-sans font-semibold text-xs uppercase tracking-wider text-devkit-text-tertiary mb-3">
      <span className="opacity-70">{icon}</span>
      <span>{title}</span>
    </div>
  )
}

function Divider() {
  return (
    <hr className="border-t border-devkit-bg-muted" />
  )
}

function ThemeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 rounded-devkit py-2 text-xs transition-all cursor-pointer border",
        active
          ? "bg-devkit-accent text-white border-devkit-accent font-semibold shadow-sm"
          : "bg-devkit-bg-subtle text-devkit-text-secondary border-devkit-bg-muted hover:border-devkit-accent/40 font-medium"
      )}
      aria-pressed={active}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function ToggleRow({
  label,
  defaultChecked = false,
}: {
  label: string
  defaultChecked?: boolean
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-1 select-none">
      <span className="text-xs font-semibold text-devkit-text-secondary font-sans">
        {label}
      </span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-8 rounded-full appearance-none bg-devkit-bg-muted border border-devkit-bg-muted checked:bg-devkit-accent checked:border-devkit-accent relative cursor-pointer before:content-[''] before:absolute before:h-3 before:w-3 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-3.5 before:transition-transform before:duration-200"
      />
    </label>
  )
}
