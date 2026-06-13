"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Search, Sparkles } from "lucide-react"
import { mockModels } from "@/lib/mock-data"
import { dropdownVariants, springs } from "@/lib/animations"
import { AIModel } from "@/lib/types"

interface ModelSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (model: AIModel) => void
  currentModelId: string
}

type Category = 'all' | 'nvidia' | 'openrouter'

export default function ModelSelector({
  isOpen,
  onClose,
  onSelect,
  currentModelId,
}: ModelSelectorProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredModels = useMemo(() => {
    let result = mockModels
    if (activeCategory !== 'all') {
      result = result.filter(m => m.provider === activeCategory)
    }
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(
        (m) => m.name.toLowerCase().includes(query) || m.company.toLowerCase().includes(query)
      )
    }
    return result
  }, [search, activeCategory])

  const groupedModels = useMemo(() => {
    const groups: Record<string, AIModel[]> = {}
    for (const model of filteredModels) {
      if (!groups[model.company]) {
        groups[model.company] = []
      }
      groups[model.company].push(model)
    }
    const sortedGroups: Record<string, AIModel[]> = {}
    Object.keys(groups).sort().forEach(key => {
      sortedGroups[key] = groups[key]
    })
    return sortedGroups
  }, [filteredModels])

  const flatModels = useMemo(() => {
    const result: AIModel[] = []
    for (const company of Object.keys(groupedModels)) {
      result.push(...groupedModels[company])
    }
    return result
  }, [groupedModels])

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
            prev < flatModels.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setHighlightIndex((prev) =>
            prev > 0 ? prev - 1 : flatModels.length - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (flatModels[highlightIndex]) {
            onSelect(flatModels[highlightIndex])
            onClose()
          }
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    },
    [flatModels, highlightIndex, onSelect, onClose]
  )

  let runningIndex = 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={springs.popup}
            className="absolute top-full left-0 z-50 mt-2 w-[440px] max-h-[500px] h-[500px] overflow-hidden rounded-2xl bg-[var(--nc-surface-1)]/95 backdrop-blur-xl border border-[var(--nc-border)] shadow-2xl flex flex-col"
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

              {/* Model list grouped by company */}
              <div ref={listRef} className="overflow-y-auto flex-1 p-2 bg-[var(--nc-surface-1)] relative">
                {flatModels.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm font-medium text-[var(--nc-text-muted)]">
                    No models found
                  </p>
                )}

                <div className="flex flex-col">
                  {Object.entries(groupedModels).map(([company, models]) => (
                    <div key={company} className="mb-4 last:mb-0">
                      {/* Company Header (Sticky) */}
                      <div className="sticky top-0 z-10 py-1.5 px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--nc-text-muted)] border-b border-[var(--nc-border)]/50 bg-[var(--nc-surface-1)]/95 backdrop-blur-md">
                        {company}
                      </div>
                      
                      {/* Models for this company */}
                      <div className="flex flex-col gap-1">
                        {models.map((model) => {
                          const index = runningIndex++
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
                                  ? "bg-[var(--nc-surface-2)] border-[var(--nc-border)]"
                                  : "bg-transparent border-transparent hover:bg-[var(--nc-surface-2)] hover:border-[var(--nc-border)]"
                              }`}
                            >
                              {/* Provider origin badge */}
                              <div className="mt-1.5 flex-shrink-0">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider border ${
                                    model.provider === 'nvidia'
                                      ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                  }`}
                                >
                                  {model.provider === 'nvidia' ? 'NV' : 'OR'}
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-[var(--nc-text-primary)] truncate">
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
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[var(--nc-surface-3)] text-[var(--nc-text-secondary)]">
                                      <Sparkles className="w-3 h-3 text-[var(--nc-accent)]" />
                                      {model.badge}
                                    </span>
                                  )}
                                  {model.status && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 uppercase tracking-wider">
                                      {model.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
