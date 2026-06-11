'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/lib/store'

export function useKeyboardShortcuts() {
  const { state, dispatch } = useChatStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // ⌘K / Ctrl+K: Toggle command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })
      }

      // Escape: Close topmost overlay (priority: command palette > settings)
      if (e.key === 'Escape') {
        if (state.commandPaletteOpen) {
          dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })
        } else if (state.settingsOpen) {
          dispatch({ type: 'TOGGLE_SETTINGS' })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.commandPaletteOpen, state.settingsOpen, dispatch])
}
