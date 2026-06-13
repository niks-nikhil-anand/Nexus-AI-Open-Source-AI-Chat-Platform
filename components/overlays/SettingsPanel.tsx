'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sun, Moon, Download, Trash2, Keyboard } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { aiModels } from '@/lib/ai-models'
import { springs } from '@/lib/animations'

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
    a.download = 'neurachat-conversations.json'
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
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-[400px] max-w-[90vw] z-50 flex flex-col overflow-hidden border-l"
            style={{
              backgroundColor: 'var(--nc-surface-1)',
              borderColor: 'var(--nc-border)',
            }}
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={springs.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
          >
            {/* Header */}
            <div
              className="flex h-[52px] shrink-0 items-center justify-between border-b px-5"
              style={{ borderColor: 'var(--nc-border)' }}
            >
              <h2
                className="text-base font-semibold"
                style={{ color: 'var(--nc-text-primary)' }}
              >
                Settings
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-[var(--nc-surface-3)]"
                style={{ color: 'var(--nc-text-secondary)' }}
                aria-label="Close settings"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {/* Appearance Section */}
              <section>
                <SectionHeader icon={<Sun className="h-4 w-4" />} title="Appearance" />
                <div className="mt-3 space-y-4">
                  {/* Theme toggle */}
                  <div>
                    <label
                      className="text-xs font-medium mb-2 block"
                      style={{ color: 'var(--nc-text-secondary)' }}
                    >
                      Theme
                    </label>
                    <div className="flex gap-2">
                      <ThemeButton
                        active={theme === 'dark'}
                        onClick={() => handleThemeChange('dark')}
                        icon={<Moon className="h-3.5 w-3.5" />}
                        label="Dark"
                      />
                      <ThemeButton
                        active={theme === 'light'}
                        onClick={() => handleThemeChange('light')}
                        icon={<Sun className="h-3.5 w-3.5" />}
                        label="Light"
                      />
                    </div>
                  </div>

                  {/* Font size slider (visual only) */}
                  <div>
                    <label
                      className="text-xs font-medium mb-2 block"
                      style={{ color: 'var(--nc-text-secondary)' }}
                    >
                      Font Size
                    </label>
                    <input
                      type="range"
                      min={12}
                      max={20}
                      defaultValue={14}
                      className="w-full accent-[var(--nc-accent)]"
                      aria-label="Font size"
                    />
                    <div
                      className="flex justify-between text-xs mt-1"
                      style={{ color: 'var(--nc-text-muted)' }}
                    >
                      <span>12px</span>
                      <span>14px</span>
                      <span>20px</span>
                    </div>
                  </div>
                </div>
              </section>

              <Divider />

              {/* Models Section */}
              <section>
                <SectionHeader icon={<span className="h-4 w-4 text-center">⚡</span>} title="Models" />
                <div className="mt-3">
                  <label
                    className="text-xs font-medium mb-2 block"
                    style={{ color: 'var(--nc-text-secondary)' }}
                  >
                    Default Model
                  </label>
                  <div className="space-y-1">
                    {aiModels.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => handleModelSelect(model)}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--nc-surface-3)]"
                        style={{
                          color:
                            selectedModel.id === model.id
                              ? 'var(--nc-accent)'
                              : 'var(--nc-text-primary)',
                          backgroundColor:
                            selectedModel.id === model.id
                              ? 'var(--nc-surface-2)'
                              : undefined,
                        }}
                      >
                        <span
                          className="inline-block h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: model.providerColor }}
                        />
                        <span className="truncate">{model.name}</span>
                        <span
                          className="ml-auto text-xs"
                          style={{ color: 'var(--nc-text-muted)' }}
                        >
                          {model.provider}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <Divider />

              {/* Chat Section */}
              <section>
                <SectionHeader icon={<span className="h-4 w-4 text-center">💬</span>} title="Chat" />
                <div className="mt-3 space-y-3">
                  <ToggleRow label="Auto-title conversations" defaultChecked />
                  <div>
                    <label
                      className="text-xs font-medium mb-1 block"
                      style={{ color: 'var(--nc-text-secondary)' }}
                    >
                      Streaming Speed
                    </label>
                    <span
                      className="text-sm"
                      style={{ color: 'var(--nc-text-primary)' }}
                    >
                      Normal
                    </span>
                  </div>
                </div>
              </section>

              <Divider />

              {/* Shortcuts Section */}
              <section>
                <SectionHeader icon={<Keyboard className="h-4 w-4" />} title="Shortcuts" />
                <div className="mt-3">
                  <table className="w-full text-sm">
                    <tbody>
                      {SHORTCUTS.map((shortcut) => (
                        <tr key={shortcut.keys}>
                          <td
                            className="py-1.5 pr-4"
                            style={{ color: 'var(--nc-text-secondary)' }}
                          >
                            {shortcut.description}
                          </td>
                          <td className="py-1.5 text-right">
                            <kbd
                              className="inline-block rounded px-2 py-0.5 text-xs font-mono border"
                              style={{
                                backgroundColor: 'var(--nc-surface-2)',
                                borderColor: 'var(--nc-border)',
                                color: 'var(--nc-text-primary)',
                              }}
                            >
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
                <SectionHeader icon={<Download className="h-4 w-4" />} title="Data" />
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={handleExportConversations}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--nc-surface-3)]"
                    style={{ color: 'var(--nc-text-primary)' }}
                  >
                    <Download className="h-4 w-4" style={{ color: 'var(--nc-accent)' }} />
                    Export Conversations
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--nc-surface-3)]"
                    style={{ color: 'var(--nc-error, #ef4444)' }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All Conversations
                  </button>
                </div>
              </section>

              <Divider />

              {/* About Section */}
              <section>
                <SectionHeader icon={<span className="h-4 w-4 text-center">ℹ️</span>} title="About" />
                <div className="mt-3 space-y-1">
                  <p className="text-sm" style={{ color: 'var(--nc-text-primary)' }}>
                    NeuraChat v0.1.0
                  </p>
                  <p className="text-xs" style={{ color: 'var(--nc-text-muted)' }}>
                    Built with Next.js, React, Framer Motion
                  </p>
                </div>
              </section>
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
    <div className="flex items-center gap-2">
      <span style={{ color: 'var(--nc-text-muted)' }}>{icon}</span>
      <h3
        className="text-sm font-semibold"
        style={{ color: 'var(--nc-text-primary)' }}
      >
        {title}
      </h3>
    </div>
  )
}

function Divider() {
  return (
    <hr
      className="border-t"
      style={{ borderColor: 'var(--nc-border)' }}
    />
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
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors border"
      style={{
        backgroundColor: active ? 'var(--nc-surface-2)' : 'transparent',
        borderColor: active ? 'var(--nc-accent)' : 'var(--nc-border)',
        color: active ? 'var(--nc-accent)' : 'var(--nc-text-secondary)',
      }}
      aria-pressed={active}
    >
      {icon}
      {label}
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
    <label className="flex items-center justify-between cursor-pointer">
      <span
        className="text-sm"
        style={{ color: 'var(--nc-text-primary)' }}
      >
        {label}
      </span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded accent-[var(--nc-accent)]"
      />
    </label>
  )
}
