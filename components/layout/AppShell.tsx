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
        className="h-full overflow-hidden bg-[var(--nc-surface-1)] border-r border-[var(--nc-border)]"
        animate={{ width: leftSidebarOpen ? 260 : 68 }}
        initial={false}
        transition={springs.panel}
      >
        <LeftSidebar />
      </motion.aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {children}
      </main>

      {/* Right Panel (Floating Drawer Overlay) */}
      <motion.aside
        className="fixed right-0 top-0 bottom-0 z-40 overflow-hidden bg-[var(--nc-surface-1)] border-l border-[var(--nc-border)] shadow-2xl"
        animate={{ x: rightPanelOpen ? 0 : 300 }}
        initial={{ x: 300 }}
        transition={springs.panel}
        style={{ width: 300 }}
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
