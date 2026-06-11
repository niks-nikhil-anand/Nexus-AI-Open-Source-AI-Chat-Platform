'use client'

import { motion } from 'framer-motion'
import { useChatStore } from '@/lib/store'
import { springs } from '@/lib/animations'
import { RightPanel } from '@/components/panel/RightPanel'
import { LeftSidebar } from '@/components/sidebar/LeftSidebar'
import { CommandPalette } from '@/components/overlays/CommandPalette'
import { SettingsPanel } from '@/components/overlays/SettingsPanel'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { state } = useChatStore()
  const { leftSidebarOpen, rightPanelOpen } = state

  // Register global keyboard shortcuts (⌘K, Esc)
  useKeyboardShortcuts()

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Sidebar */}
      <motion.aside
        className="h-full overflow-hidden bg-[var(--nc-surface1)] border-r border-[var(--nc-border)]"
        animate={{ width: leftSidebarOpen ? 260 : 0 }}
        initial={false}
        transition={springs.panel}
      >
        <LeftSidebar />
      </motion.aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {children}
      </main>

      {/* Right Panel */}
      <motion.aside
        className="h-full overflow-hidden bg-[var(--nc-surface1)] border-l border-[var(--nc-border)]"
        animate={{ width: rightPanelOpen ? 300 : 0 }}
        initial={false}
        transition={springs.panel}
      >
        <div className="h-full w-[300px]">
          <RightPanel />
        </div>
      </motion.aside>

      {/* Overlay portals (positioned fixed, rendered inside AppShell) */}
      <CommandPalette />
      <SettingsPanel />
    </div>
  )
}
