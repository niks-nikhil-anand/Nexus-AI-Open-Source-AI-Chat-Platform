"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckIcon, Search01Icon, SparklesIcon } from '@hugeicons/core-free-icons'
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
            className="absolute bottom-full right-0 z-50 mb-3 w-[440px] max-h-[450px] h-[450px] overflow-hidden rounded-lg-devkit border border-devkit-bg-muted bg-devkit-bg/95 backdrop-blur-md shadow-2xl flex flex-col pointer-events-auto"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="p-3 border-b border-devkit-bg-muted">
              <div className="flex items-center gap-2 px-3 py-2 rounded-devkit bg-devkit-bg-subtle border border-devkit-bg-muted focus-within:border-devkit-accent/40 transition-colors">
                <HugeiconsIcon icon={Search01Icon} size={14} className="text-devkit-text-tertiary" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search models..."
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
              <div className="w-[140px] bg-devkit-bg-subtle/30 border-r border-devkit-bg-muted flex flex-col p-2 gap-1 overflow-y-auto">
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

              {/* Model list */}
              <div ref={listRef} className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                {filteredModels.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm font-medium text-devkit-text-tertiary font-sans">
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
                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-devkit text-left transition-all border group cursor-pointer ${
                          isSelected
                            ? "bg-devkit-accent/15 border-devkit-accent/30 text-devkit-text"
                            : isHighlighted
                            ? "bg-devkit-bg-subtle border-devkit-bg-muted text-devkit-text"
                            : "bg-transparent border-transparent text-devkit-text hover:bg-devkit-bg-subtle hover:border-devkit-bg-muted"
                        }`}
                      >
                        {/* Provider origin badge */}
                        <div className="mt-1 flex-shrink-0">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider border ${
                              model.provider === 'nvidia'
                                ? 'bg-[#2dd4a7]/10 text-[#2dd4a7] border-[#2dd4a7]/20'
                                : 'bg-[#7c6ff7]/10 text-[#7c6ff7] border-[#7c6ff7]/20'
                            }`}
                          >
                            {model.provider === 'nvidia' ? 'NV' : 'OR'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-semibold truncate ${isSelected ? 'text-devkit-accent font-bold' : 'text-devkit-text'}`}>
                              {model.name}
                            </span>
                            <span className="text-xs text-devkit-text-secondary truncate font-mono">
                              {model.size}
                            </span>
                            {isSelected && (
                              <HugeiconsIcon icon={CheckIcon} size={14} className="text-devkit-accent flex-shrink-0 ml-auto" />
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {model.badge && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-devkit-accent/10 text-devkit-accent border border-devkit-accent/20 font-mono">
                                <HugeiconsIcon icon={SparklesIcon} size={10} className="text-devkit-accent" />
                                {model.badge}
                              </span>
                            )}
                            {model.status && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-devkit-bg-muted text-devkit-text-secondary border border-devkit-bg-muted/40 uppercase tracking-wider">
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
