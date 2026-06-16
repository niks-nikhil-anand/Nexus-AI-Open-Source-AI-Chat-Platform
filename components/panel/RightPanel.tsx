'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon, CpuIcon } from '@hugeicons/core-free-icons'
import { useChatStore } from '@/lib/store'

function formatContextWindow(value?: number): string {
  if (value === undefined) return 'Unknown'
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`
  }
  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`
  }
  return value.toString()
}

function CircularProgress({ value, label }: { value: number; label: string }) {
  const radius = 22
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center p-3.5 rounded-devkit bg-devkit-bg-subtle border border-devkit-bg-muted shadow-sm hover:border-devkit-accent/20 transition-all duration-200">
      <div className="relative flex items-center justify-center h-16 w-16">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="stroke-devkit-bg-muted"
            strokeWidth="3.5"
            fill="none"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            strokeWidth="3.5"
            className="stroke-devkit-accent"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            key={value}
          />
        </svg>
        <span className="absolute text-xs font-extrabold text-devkit-text font-sans">
          {value}%
        </span>
      </div>
      <span className="mt-2 text-[9px] uppercase font-bold tracking-wider text-devkit-text-secondary font-mono">
        {label}
      </span>
    </div>
  )
}

export function RightPanel() {
  const { state, dispatch } = useChatStore()
  const { selectedModel } = state

  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)

  const contextWindow = selectedModel.contextWindow ?? 131072

  // Auto-clamp max tokens when changing models if they exceed the context window
  useEffect(() => {
    if (maxTokens > contextWindow) {
      setMaxTokens(contextWindow)
    }
  }, [contextWindow, maxTokens])

  return (
    <div className="h-full overflow-y-auto p-5 flex flex-col gap-4 bg-devkit-bg border-l border-devkit-bg-muted custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-devkit-text-tertiary font-mono">
          Model Details
        </h2>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_RIGHT_PANEL' })}
          className="flex items-center justify-center rounded-devkit border border-devkit-bg-muted bg-devkit-bg text-devkit-text-secondary hover:text-devkit-text hover:border-devkit-accent/40 p-1.5 transition-all cursor-pointer h-7 w-7"
          aria-label="Close panel"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </button>
      </div>

      {/* Model Card Header */}
      <div className="flex flex-col gap-1.5">
        <div className="font-sans text-[16px] font-bold text-devkit-text tracking-tight">
          {selectedModel.name}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: selectedModel.providerColor }}
          />
          <span className="text-xs text-devkit-text-secondary font-medium capitalize">
            {selectedModel.provider}
          </span>
          {selectedModel.isNew && (
            <span
              className="ml-auto inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-devkit-accent bg-devkit-accent/10 border border-devkit-accent/20"
            >
              New
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed text-devkit-text-secondary font-sans">
        {selectedModel.description}
      </p>

      {/* Stat Cards: Context & Params */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-devkit p-3 bg-devkit-bg-subtle border border-devkit-bg-muted">
          <div className="text-[9px] font-bold uppercase tracking-wider text-devkit-text-tertiary font-mono">Context Window</div>
          <div className="mt-1.5 text-sm font-extrabold text-devkit-text font-sans">
            {formatContextWindow(selectedModel.contextWindow)}
          </div>
        </div>
        <div className="rounded-devkit p-3 bg-devkit-bg-subtle border border-devkit-bg-muted">
          <div className="text-[9px] font-bold uppercase tracking-wider text-devkit-text-tertiary font-mono">Parameters</div>
          <div className="mt-1.5 text-sm font-extrabold text-devkit-text font-sans flex items-center gap-1">
            <HugeiconsIcon icon={CpuIcon} size={12} className="text-devkit-text-secondary opacity-75" />
            <span>{selectedModel.parameters ?? 'Unknown'}</span>
          </div>
        </div>
      </div>

      {/* Visual Stats: Reasoning & Coding Circular Progress */}
      <div className="grid grid-cols-2 gap-3">
        <CircularProgress value={selectedModel.reasoningScore ?? 0} label="Reasoning" />
        <CircularProgress value={selectedModel.codingScore ?? 0} label="Coding" />
      </div>

      {/* Capabilities Progress Bars */}
      <div className="space-y-3.5 bg-devkit-bg-subtle/50 border border-devkit-bg-muted rounded-devkit p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-devkit-text-tertiary font-mono">
          Capabilities
        </div>
        
        {/* Reasoning Progress */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-devkit-text-secondary">
            <span>Reasoning Level</span>
            <span className="font-bold text-devkit-text">{selectedModel.reasoningScore ?? 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-devkit-bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--devkit-accent), var(--devkit-blue))',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${selectedModel.reasoningScore ?? 0}%` }}
              transition={{ delay: 0.1, duration: 0.8 }}
              key={`reasoning-${selectedModel.id}`}
            />
          </div>
        </div>

        {/* Coding Progress */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-devkit-text-secondary">
            <span>Coding Level</span>
            <span className="font-bold text-devkit-text">{selectedModel.codingScore ?? 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-devkit-bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--devkit-blue), var(--devkit-teal))',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${selectedModel.codingScore ?? 0}%` }}
              transition={{ delay: 0.2, duration: 0.8 }}
              key={`coding-${selectedModel.id}`}
            />
          </div>
        </div>
      </div>

      {/* Strengths Chips */}
      <div>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-devkit-text-tertiary font-mono">
          Strengths
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(selectedModel.strengths || (selectedModel.badge ? [selectedModel.badge] : [])).map((strength) => (
            <span
              key={strength}
              className="rounded-full px-2.5 py-0.5 text-[9px] font-semibold text-devkit-accent bg-devkit-accent/10 border border-devkit-accent/20 shadow-sm font-mono"
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-devkit-bg-muted/50" />

      {/* Configurations */}
      <div className="flex flex-col gap-4">
        {/* Temperature Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="temperature-slider"
              className="text-xs font-semibold text-devkit-text-secondary"
            >
              Temperature
            </label>
            <span className="text-xs font-bold text-devkit-text bg-devkit-bg-subtle px-2 py-0.5 rounded-devkit border border-devkit-bg-muted font-mono">
              {temperature.toFixed(1)}
            </span>
          </div>
          <input
            id="temperature-slider"
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-devkit-bg-muted rounded-lg appearance-none cursor-pointer accent-devkit-accent focus:outline-none"
          />
        </div>

        {/* Max Tokens Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="max-tokens-slider"
              className="text-xs font-semibold text-devkit-text-secondary"
            >
              Max Tokens
            </label>
            <span className="text-xs font-bold text-devkit-text bg-devkit-bg-subtle px-2 py-0.5 rounded-devkit border border-devkit-bg-muted font-mono">
              {maxTokens.toLocaleString()}
            </span>
          </div>
          <input
            id="max-tokens-slider"
            type="range"
            min={256}
            max={contextWindow}
            step={256}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            className="w-full h-1.5 bg-devkit-bg-muted rounded-lg appearance-none cursor-pointer accent-devkit-accent focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
