"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Search, Cpu } from "lucide-react"
import { aiModels } from "@/lib/ai-models"
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
    let result = aiModels
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
      highlighted.scrollIntoView({ block: "nearest", behavior: "smooth" })
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
            className="absolute top-full left-4 z-50 mt-2 w-[480px] max-h-[550px] h-[550px] overflow-hidden rounded-2xl bg-[var(--nc-surface-1)]/95 backdrop-blur-xl border border-[var(--nc-border)] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col"
            onKeyDown={handleKeyDown}
          >
            {/* Horizontal Tabs */}
            <div className="flex items-center gap-2 p-3 pb-2 overflow-x-auto scrollbar-hide shrink-0">
              <button
                onClick={() => { setActiveCategory('all'); setHighlightIndex(0); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[var(--nc-text-primary)] text-[var(--nc-surface-1)]'
                    : 'bg-[var(--nc-surface-2)] text-[var(--nc-text-secondary)] hover:text-[var(--nc-text-primary)] hover:bg-[var(--nc-surface-3)]'
                }`}
              >
                All Models
              </button>
              <button
                onClick={() => { setActiveCategory('nvidia'); setHighlightIndex(0); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === 'nvidia'
                    ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                    : 'bg-[var(--nc-surface-2)] text-[var(--nc-text-secondary)] hover:text-[var(--nc-text-primary)] hover:bg-[var(--nc-surface-3)]'
                }`}
              >
                Nvidia API
              </button>
              <button
                onClick={() => { setActiveCategory('openrouter'); setHighlightIndex(0); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === 'openrouter'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-[var(--nc-surface-2)] text-[var(--nc-text-secondary)] hover:text-[var(--nc-text-primary)] hover:bg-[var(--nc-surface-3)]'
                }`}
              >
                OpenRouter API
              </button>
            </div>

            {/* Search input */}
            <div className="px-3 pb-3 border-b border-[var(--nc-border)] shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--nc-surface-2)] border border-[var(--nc-border)] focus-within:border-[var(--nc-accent)] transition-colors">
                <Search className="w-4 h-4 text-[var(--nc-text-muted)]" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search models or providers..."
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
              {/* Model list grouped by company */}
              <div ref={listRef} className="overflow-y-auto flex-1 p-3 bg-[var(--nc-surface-1)] relative scroll-smooth">
                {flatModels.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-[var(--nc-text-muted)]">
                    <Search className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm font-medium">No models found</p>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {Object.entries(groupedModels).map(([company, models]) => (
                    <div key={company} className="flex flex-col">
                      {/* Company Header */}
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--nc-text-muted)]">
                          {company}
                        </span>
                        <div className="flex-1 h-px bg-[var(--nc-border)]/50" />
                      </div>
                      
                      {/* Models for this company */}
                      <div className="flex flex-col gap-1.5">
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
                              className={`relative w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 border group ${
                                isSelected
                                  ? "bg-[var(--nc-accent)]/10 border-[var(--nc-accent)]/30 shadow-[0_0_15px_rgba(var(--nc-accent-rgb),0.15)]"
                                  : isHighlighted
                                  ? "bg-[var(--nc-surface-2)] border-[var(--nc-border)]"
                                  : "bg-transparent border-transparent hover:bg-[var(--nc-surface-2)] hover:border-[var(--nc-border)]"
                              }`}
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                {/* Provider origin badge */}
                                <div className="mt-1 flex-shrink-0">
                                  <span
                                    className={`flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold border ${
                                      model.provider === 'nvidia'
                                        ? 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20'
                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20'
                                    }`}
                                  >
                                    {model.provider === 'nvidia' ? 'NV' : 'OR'}
                                  </span>
                                </div>

                                <div className="flex flex-col gap-1 min-w-0">
                                  <span className={`text-[15px] font-bold truncate transition-colors ${
                                    isSelected ? 'text-[var(--nc-accent)] dark:text-[var(--nc-text-primary)]' : 'text-[var(--nc-text-primary)]'
                                  }`}>
                                    {model.name}
                                  </span>
                                  
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {/* Parameter Size Pill */}
                                    {model.size && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                                        <Cpu className="w-3 h-3 opacity-70" />
                                        {model.size}
                                      </span>
                                    )}
                                    
                                    {/* Feature Badge Pill */}
                                    {model.badge && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                        {model.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Selected Checkmark */}
                              {isSelected && (
                                <div className="flex-shrink-0 ml-3">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--nc-accent)] text-white shadow-[0_0_10px_rgba(var(--nc-accent-rgb),0.5)]">
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="p-3 border-t border-[var(--nc-border)] shrink-0 bg-[var(--nc-surface-2)]/50 text-center">
              <span className="text-[11px] font-medium text-[var(--nc-text-muted)]">
                All models are currently <span className="text-[var(--nc-text-secondary)] font-bold">FREE</span> for use
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
