"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckIcon, Search01Icon, CpuIcon } from '@hugeicons/core-free-icons'
import { aiModels } from "@/lib/ai-models"
import { dropdownVariants, springs } from "@/lib/animations"
import { AIModel } from "@/lib/types"
import { cn } from "@/lib/utils"

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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={springs.popup}
            className="absolute top-full left-4 z-50 mt-2 w-[480px] max-h-[550px] h-[550px] overflow-hidden rounded-lg-devkit border border-devkit-bg-muted bg-devkit-bg/95 backdrop-blur-md shadow-2xl flex flex-col pointer-events-auto"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            onKeyDown={handleKeyDown}
          >

            {/* Search input */}
            <div className="p-3 border-b border-devkit-bg-muted shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-devkit bg-devkit-bg-subtle border border-devkit-bg-muted focus-within:border-devkit-accent/40 transition-colors">
                <HugeiconsIcon icon={Search01Icon} size={14} className="text-devkit-text-tertiary" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search models or providers..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setHighlightIndex(0)
                  }}
                  className="flex-1 bg-transparent text-sm text-devkit-text placeholder:text-devkit-text-tertiary outline-none font-sans"
                />
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-[140px] bg-devkit-bg-subtle/30 border-r border-devkit-bg-muted flex flex-col p-2 gap-1 overflow-y-auto shrink-0">
                <button
                  onClick={() => { setActiveCategory('all'); setHighlightIndex(0); }}
                  className={`px-3 py-2.5 rounded-devkit text-xs font-semibold text-left transition-colors cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-devkit-bg-muted border border-devkit-bg-muted/30 text-devkit-text shadow-sm'
                      : 'text-devkit-text-secondary hover:text-devkit-text hover:bg-devkit-bg-subtle'
                  }`}
                >
                  All Models
                </button>
                <button
                  onClick={() => { setActiveCategory('nvidia'); setHighlightIndex(0); }}
                  className={`px-3 py-2.5 rounded-devkit text-xs font-semibold text-left transition-colors cursor-pointer flex items-center justify-between ${
                    activeCategory === 'nvidia'
                      ? 'bg-devkit-bg-muted border border-devkit-bg-muted/30 text-devkit-text shadow-sm'
                      : 'text-devkit-text-secondary hover:text-devkit-text hover:bg-devkit-bg-subtle'
                  }`}
                >
                  Nvidia API
                </button>
                <button
                  onClick={() => { setActiveCategory('openrouter'); setHighlightIndex(0); }}
                  className={`px-3 py-2.5 rounded-devkit text-xs font-semibold text-left transition-colors cursor-pointer ${
                    activeCategory === 'openrouter'
                      ? 'bg-devkit-bg-muted border border-devkit-bg-muted/30 text-devkit-text shadow-sm'
                      : 'text-devkit-text-secondary hover:text-devkit-text hover:bg-devkit-bg-subtle'
                  }`}
                >
                  OpenRouter API
                </button>
              </div>

              {/* Model list grouped by company */}
              <div ref={listRef} className="overflow-y-auto flex-1 p-3 bg-devkit-bg relative scroll-smooth custom-scrollbar">
                {flatModels.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-devkit-text-tertiary">
                    <HugeiconsIcon icon={Search01Icon} size={32} className="mb-3 opacity-20" />
                    <p className="text-sm font-medium font-sans">No models found</p>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {Object.entries(groupedModels).map(([company, models]) => (
                    <div key={company} className="flex flex-col">
                      {/* Company Header */}
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-devkit-text-tertiary font-mono">
                          {company}
                        </span>
                        <div className="flex-1 h-px bg-devkit-bg-muted/50" />
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
                              className={`relative w-full flex items-center justify-between p-3 rounded-devkit text-left transition-all duration-200 border group cursor-pointer ${
                                isSelected
                                  ? "bg-devkit-accent/10 border-devkit-accent/30 shadow-[0_0_15px_rgba(124,111,247,0.15)]"
                                  : isHighlighted
                                  ? "bg-devkit-bg-subtle border-devkit-bg-muted text-devkit-text"
                                  : "bg-transparent border-transparent text-devkit-text hover:bg-devkit-bg-subtle hover:border-devkit-bg-muted"
                              }`}
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                {/* Provider origin badge */}
                                <div className="mt-1 flex-shrink-0">
                                  <span
                                    className={`flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-mono font-bold border ${
                                      model.provider === 'nvidia'
                                        ? 'bg-[#2dd4a7]/10 text-[#2dd4a7] border-[#2dd4a7]/20'
                                        : 'bg-[#7c6ff7]/10 text-[#7c6ff7] border-[#7c6ff7]/20'
                                    }`}
                                  >
                                    {model.provider === 'nvidia' ? 'NV' : 'OR'}
                                  </span>
                                </div>

                                <div className="flex flex-col gap-1 min-w-0">
                                  <span className={`text-[14px] font-bold truncate transition-colors ${
                                    isSelected ? 'text-devkit-accent' : 'text-devkit-text group-hover:text-devkit-accent'
                                  }`}>
                                    {model.name}
                                  </span>
                                  
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {/* Parameter Size Pill */}
                                    {model.size && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-devkit-bg-muted text-devkit-text-secondary border border-devkit-bg-muted/40 font-mono">
                                        <HugeiconsIcon icon={CpuIcon} size={10} className="opacity-70" />
                                        {model.size}
                                      </span>
                                    )}
                                    
                                    {/* Feature Badge Pill */}
                                    {model.badge && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-devkit-accent/10 text-devkit-accent border border-devkit-accent/20 font-mono">
                                        {model.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Selected Checkmark */}
                              {isSelected && (
                                <div className="flex-shrink-0 ml-3">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-devkit-accent text-white shadow-[0_0_10px_rgba(124,111,247,0.5)]">
                                    <HugeiconsIcon icon={CheckIcon} size={12} />
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
            <div className="p-3 border-t border-devkit-bg-muted shrink-0 bg-devkit-bg-subtle/50 text-center">
              <span className="text-[10px] font-medium text-devkit-text-tertiary font-sans">
                All models are currently <span className="text-devkit-accent font-bold">FREE</span> for use
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
