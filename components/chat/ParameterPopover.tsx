"use client"

import { useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon } from '@hugeicons/react'
import { Settings02Icon, UndoIcon } from '@hugeicons/core-free-icons'
import { springs } from "@/lib/animations"
import { useChatStore } from "@/lib/store"

interface ParameterPopoverProps {
  isOpen: boolean
  onClose: () => void
}

export function ParameterPopover({ isOpen, onClose }: ParameterPopoverProps) {
  const { state, dispatch } = useChatStore()
  const { theme, temperature, top_p, max_tokens, selectedModel } = state
  const popoverRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const slideUpVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0 },
  }

  const handleReset = () => {
    dispatch({ type: "SET_TEMPERATURE", payload: 1.0 })
    dispatch({ type: "SET_TOP_P", payload: 0.95 })
    dispatch({ type: "SET_MAX_TOKENS", payload: 4096 })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={springs.popup}
          className="absolute bottom-full right-0 z-50 mb-3 w-72 overflow-hidden rounded-lg-devkit border border-devkit-bg-muted bg-devkit-bg/95 backdrop-blur-md shadow-2xl flex flex-col pointer-events-auto"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
          role="dialog"
          aria-label="Inference Settings"
        >
          <div className="p-4 flex items-center justify-between border-b border-devkit-bg-muted bg-devkit-bg-subtle/30">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Settings02Icon} size={14} className="text-devkit-text-tertiary" />
              <span className="text-xs font-bold text-devkit-text">Inference Settings</span>
            </div>
            <button
              onClick={handleReset}
              className="group flex items-center gap-1.5 text-[10px] font-semibold text-devkit-text-secondary hover:text-devkit-accent transition-colors cursor-pointer"
              aria-label="Reset to Defaults"
            >
              <HugeiconsIcon icon={UndoIcon} size={12} className="transition-transform group-hover:-rotate-12" />
              Reset
            </button>
          </div>

          <div className="p-4 flex flex-col gap-5">
            {/* Temperature Control */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="temp-slider" className="text-[11px] font-semibold text-devkit-text-secondary">
                  Temperature
                </label>
                <span className="text-[11px] font-mono font-bold text-devkit-text bg-devkit-bg-subtle px-2 py-0.5 rounded-devkit border border-devkit-bg-muted">
                  {temperature.toFixed(2)}
                </span>
              </div>
              <input
                id="temp-slider"
                type="range"
                min={0}
                max={2}
                step={0.05}
                value={temperature}
                onChange={(e) => dispatch({ type: "SET_TEMPERATURE", payload: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-devkit-bg-muted rounded-lg appearance-none cursor-pointer accent-devkit-accent focus:outline-none"
                aria-label="Temperature"
              />
            </div>

            {/* Top P Control */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="topp-slider" className="text-[11px] font-semibold text-devkit-text-secondary">
                  Top P
                </label>
                <span className="text-[11px] font-mono font-bold text-devkit-text bg-devkit-bg-subtle px-2 py-0.5 rounded-devkit border border-devkit-bg-muted">
                  {top_p.toFixed(2)}
                </span>
              </div>
              <input
                id="topp-slider"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={top_p}
                onChange={(e) => dispatch({ type: "SET_TOP_P", payload: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-devkit-bg-muted rounded-lg appearance-none cursor-pointer accent-devkit-accent focus:outline-none"
                aria-label="Top P"
              />
            </div>

            {/* Max Tokens Control */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="tokens-slider" className="text-[11px] font-semibold text-devkit-text-secondary">
                  Max Tokens
                </label>
                <span className="text-[11px] font-mono font-bold text-devkit-text bg-devkit-bg-subtle px-2 py-0.5 rounded-devkit border border-devkit-bg-muted">
                  {max_tokens.toLocaleString()}
                </span>
              </div>
              <input
                id="tokens-slider"
                type="range"
                min={1}
                max={selectedModel.contextWindow}
                step={128}
                value={max_tokens}
                onChange={(e) => dispatch({ type: "SET_MAX_TOKENS", payload: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-devkit-bg-muted rounded-lg appearance-none cursor-pointer accent-devkit-accent focus:outline-none"
                aria-label="Max Tokens"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
