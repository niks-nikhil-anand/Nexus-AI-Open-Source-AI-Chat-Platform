"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Search, Sparkles } from "lucide-react"
import { aiModels } from "@/lib/ai-models"
import { springs } from "@/lib/animations"
import { AIModel } from "@/lib/types"
import { useChatStore } from "@/lib/store"

interface InputModelSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (model: AIModel) => void
  currentModelId: string
}

type Category = 'all' | 'nvidia' | 'openrouter'

export function InputModelSelector({
  isOpen,
  onClose,
  onSelect,
  currentModelId,
}: InputModelSelectorProps) {
  const { state } = useChatStore()
  const { theme } = state

  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredModels = useMemo(() => {
    let result = aiModels
    if (activeCategory !== 'all') {
      result = result.filter(m => m.provider === activeCategory)
    }
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(
        (m) => m.name.toLowerCase().includes(query)
      )
    }
    return result
  }, [search, activeCategory])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setSearch("")
        setActiveCategory('all')
        setHighlightIndex(0)
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!listRef.current) return
    const highlighted = listRef.current.querySelector(
      `[data-index="${highlightIndex}"]`
    )
    if (highlighted) {
      highlighted.scrollIntoView({ block: "nearest" })
    }
  }, [highlightIndex])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setHighlightIndex((prev) =>
            prev < filteredModels.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setHighlightIndex((prev) =>
            prev > 0 ? prev - 1 : filteredModels.length - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (filteredModels[highlightIndex]) {
            onSelect(filteredModels[highlightIndex])
            onClose()
          }
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    },
    [filteredModels, highlightIndex, onSelect, onClose]
  )

  const slideUpVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={springs.popup}
            className="absolute bottom-full right-0 z-50 mb-3 w-[440px] max-h-[450px] h-[450px] overflow-hidden rounded-2xl border shadow-2xl flex flex-col pointer-events-auto"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(20, 19, 26, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              borderColor: theme === 'dark' ? 'var(--nc-border)' : '#e2e8f0',
              boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="p-3 border-b border-[var(--nc-border)]">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--nc-surface-2)] border border-[var(--nc-border)] focus-within:border-[var(--nc-accent)] transition-colors">
                <Search className="w-4 h-4 text-[var(--nc-text-muted)]" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setHighlightIndex(0)
                  }}
                  className="flex-1 bg-transparent text-sm text-[var(--nc-text-primary)] placeholder:text-[var(--nc-text-muted)] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-[140px] bg-[var(--nc-surface-2)]/30 border-r border-[var(--nc-border)] flex flex-col p-2 gap-1 overflow-y-auto">
                <button
                  onClick={() => { setActiveCategory('all'); setHighlightIndex(0); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-[var(--nc-surface-3)] text-[var(--nc-text-primary)] shadow-sm'
                      : 'text-[var(--nc-text-secondary)] hover:text-[var(--nc-text-primary)] hover:bg-[var(--nc-surface-2)]'
                  }`}
                >
                  All Models
                </button>
                <button
                  onClick={() => { setActiveCategory('nvidia'); setHighlightIndex(0); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                    activeCategory === 'nvidia'
                      ? 'bg-[var(--nc-surface-3)] text-[var(--nc-text-primary)] shadow-sm'
                      : 'text-[var(--nc-text-secondary)] hover:text-[var(--nc-text-primary)] hover:bg-[var(--nc-surface-2)]'
                  }`}
                >
                  Nvidia API
                </button>
                <button
                  onClick={() => { setActiveCategory('openrouter'); setHighlightIndex(0); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    activeCategory === 'openrouter'
                      ? 'bg-[var(--nc-surface-3)] text-[var(--nc-text-primary)] shadow-sm'
                      : 'text-[var(--nc-text-secondary)] hover:text-[var(--nc-text-primary)] hover:bg-[var(--nc-surface-2)]'
                  }`}
                >
                  OpenRouter API
                </button>
              </div>

              {/* Model list */}
              <div ref={listRef} className="overflow-y-auto flex-1 p-2">
                {filteredModels.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm font-medium text-[var(--nc-text-muted)]">
                    No models found
                  </p>
                )}

                <div className="flex flex-col gap-1">
                  {filteredModels.map((model, index) => {
                    const isSelected = model.id === currentModelId
                    const isHighlighted = index === highlightIndex

                    return (
                      <button
                        key={model.id}
                        data-index={index}
                        onClick={() => {
                          onSelect(model)
                          onClose()
                        }}
                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors border group ${
                          isSelected
                            ? "bg-[var(--nc-accent-dim)] border-[var(--nc-accent)]/30"
                            : isHighlighted
                            ? "bg-[var(--nc-surface-3)] border-[var(--nc-border)]"
                            : "bg-transparent border-transparent hover:bg-[var(--nc-surface-2)] hover:border-[var(--nc-border)]"
                        }`}
                      >
                              {/* Provider origin badge */}
                              <div className="mt-1.5 flex-shrink-0">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider border ${
                                    model.provider === 'nvidia'
                                      ? 'bg-green-500/10 text-green-700 dark:text-green-500 border-green-500/20'
                                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-500/20'
                                  }`}
                                >
                                  {model.provider === 'nvidia' ? 'NV' : 'OR'}
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-sm font-semibold truncate ${isSelected ? 'text-[var(--nc-accent)] dark:text-[var(--nc-text-primary)]' : 'text-[var(--nc-text-primary)] group-hover:text-black dark:group-hover:text-[var(--nc-text-primary)]'}`}>
                                    {model.name}
                                  </span>
                                  <span className="text-xs text-[var(--nc-text-muted)] truncate">
                                    {model.size}
                                  </span>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-[var(--nc-accent)] flex-shrink-0 ml-auto" />
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {model.badge && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[var(--nc-surface-3)] text-[var(--nc-accent)]">
                                      <Sparkles className="w-3 h-3 text-[var(--nc-accent)]" />
                                      {model.badge}
                                    </span>
                                  )}
                                  {model.status && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-200 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700/50 uppercase tracking-wider">
                                      {model.status}
                                    </span>
                                  )}
                                </div>
                              </div></button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
