"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Search } from "lucide-react"
import { mockModels, PROVIDER_COLORS } from "@/lib/mock-data"
import { dropdownVariants, springs } from "@/lib/animations"
import { AIModel, ModelProvider } from "@/lib/types"

interface ModelSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (model: AIModel) => void
  currentModelId: string
}

export default function ModelSelector({
  isOpen,
  onClose,
  onSelect,
  currentModelId,
}: ModelSelectorProps) {
  const [search, setSearch] = useState("")
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Filter models by search query (case-insensitive match on name or provider)
  const filteredModels = useMemo(() => {
    if (!search.trim()) return mockModels
    const query = search.toLowerCase()
    return mockModels.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.provider.toLowerCase().includes(query)
    )
  }, [search])

  // Group filtered models by provider
  const groupedModels = useMemo(() => {
    const groups: Record<string, AIModel[]> = {}
    for (const model of filteredModels) {
      if (!groups[model.provider]) {
        groups[model.provider] = []
      }
      groups[model.provider].push(model)
    }
    return groups
  }, [filteredModels])

  // Flat list of visible models for keyboard navigation indexing
  const flatModels = useMemo(() => {
    const result: AIModel[] = []
    for (const provider of Object.keys(groupedModels)) {
      result.push(...groupedModels[provider])
    }
    return result
  }, [groupedModels])

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setSearch("")
        setHighlightIndex(0)
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Scroll highlighted item into view
  useEffect(() => {
    if (!listRef.current) return
    const highlighted = listRef.current.querySelector(
      `[data-index="${highlightIndex}"]`
    )
    if (highlighted) {
      highlighted.scrollIntoView({ block: "nearest" })
    }
  }, [highlightIndex])

  // Keyboard navigation handler
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



  // Track a running index across groups for flat indexing
  let runningIndex = 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={springs.popup}
            className="absolute top-full left-0 z-50 mt-2 w-80 max-h-[400px] overflow-hidden rounded-xl bg-[var(--nc-surface-1)]/90 backdrop-blur-md border border-[var(--nc-border)] shadow-xl flex flex-col"
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="p-3 border-b border-[var(--nc-border)]">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--nc-surface-2)] border border-[var(--nc-border)]">
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

            {/* Model list */}
            <div ref={listRef} className="overflow-y-auto flex-1 p-2">
              {Object.keys(groupedModels).length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-[var(--nc-text-muted)]">
                  No models found
                </p>
              )}

              {Object.entries(groupedModels).map(([provider, models]) => (
                <div key={provider} className="mb-2 last:mb-0">
                  {/* Provider group header */}
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--nc-text-muted)]">
                    {provider}
                  </div>

                  {/* Model rows */}
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
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isHighlighted
                            ? "bg-[var(--nc-surface-2)]"
                            : "hover:bg-[var(--nc-surface-2)]"
                        }`}
                      >
                        {/* Provider color dot */}
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              PROVIDER_COLORS[
                                model.provider as keyof typeof PROVIDER_COLORS
                              ] || "var(--nc-text-muted)",
                          }}
                        />

                        {/* Model name */}
                        <span className="flex-1 text-sm text-[var(--nc-text-primary)] truncate">
                          {model.name}
                        </span>

                        {/* Parameters (right-aligned, muted) */}
                        <span className="text-xs text-[var(--nc-text-muted)] flex-shrink-0">
                          {model.parameters}
                        </span>

                        {/* Check icon if selected */}
                        {isSelected && (
                          <Check className="w-4 h-4 text-[var(--nc-accent)] flex-shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
