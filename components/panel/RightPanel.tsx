'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useChatStore } from '@/lib/store'

function formatContextWindow(value: number): string {
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
    <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[var(--nc-surface-2)] border border-[var(--nc-border)] shadow-sm hover:border-[var(--nc-accent)]/20 transition-all duration-200">
      <div className="relative flex items-center justify-center h-16 w-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="text-[var(--nc-surface-3)]"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="transparent"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            strokeWidth="3.5"
            stroke="var(--nc-accent)"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            key={value}
          />
        </svg>
        <span className="absolute text-[13px] font-bold text-[var(--nc-text-primary)]">
          {value}%
        </span>
      </div>
      <span className="mt-2 text-[10px] uppercase font-bold tracking-wider text-[var(--nc-text-secondary)]">
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

  // Auto-clamp max tokens when changing models if they exceed the context window
  useEffect(() => {
    if (maxTokens > selectedModel.contextWindow) {
      setMaxTokens(selectedModel.contextWindow)
    }
  }, [selectedModel, maxTokens])

  return (
    <div
      className="h-full overflow-y-auto p-4 flex flex-col gap-4"
      style={{ background: 'var(--nc-surface-1)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[var(--nc-text-muted)]">
          Model Details
        </h2>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_RIGHT_PANEL' })}
          className="rounded p-1 text-[var(--nc-text-muted)] hover:bg-[var(--nc-surface-3)] hover:text-[var(--nc-text-primary)] transition-colors cursor-pointer"
          aria-label="Close panel"
        >
          <X size={15} />
        </button>
      </div>

      {/* Model Card Header */}
      <div className="flex flex-col gap-1.5">
        <div className="font-[var(--font-dm-sans)] text-[18px] font-bold text-[var(--nc-text-primary)]">
          {selectedModel.name}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: selectedModel.providerColor }}
          />
          <span className="text-[12px] text-[var(--nc-text-secondary)] font-medium">
            {selectedModel.provider}
          </span>
          {selectedModel.isNew && (
            <span
              className="ml-auto inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--nc-accent)] bg-[var(--nc-accent-dim)] border border-[var(--nc-accent)]/20"
            >
              New
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] leading-relaxed text-[var(--nc-text-secondary)]">
        {selectedModel.description}
      </p>

      {/* Stat Cards: Context & Params */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3 bg-[var(--nc-surface-2)] border border-[var(--nc-border)]">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--nc-text-muted)]">Context Window</div>
          <div className="mt-1 text-sm font-bold text-[var(--nc-text-primary)]">
            {formatContextWindow(selectedModel.contextWindow)}
          </div>
        </div>
        <div className="rounded-xl p-3 bg-[var(--nc-surface-2)] border border-[var(--nc-border)]">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--nc-text-muted)]">Parameters</div>
          <div className="mt-1 text-sm font-bold text-[var(--nc-text-primary)]">
            {selectedModel.parameters}
          </div>
        </div>
      </div>

      {/* Visual Stats: Reasoning & Coding Circular Progress */}
      <div className="grid grid-cols-2 gap-3">
        <CircularProgress value={selectedModel.reasoningScore} label="Reasoning" />
        <CircularProgress value={selectedModel.codingScore} label="Coding" />
      </div>

      {/* Capabilities Progress Bars */}
      <div className="space-y-3 bg-[var(--nc-surface-2)]/40 border border-[var(--nc-border)] rounded-xl p-3.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--nc-text-muted)]">
          Capabilities
        </div>
        
        {/* Reasoning Progress */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="text-[var(--nc-text-secondary)] font-medium">Reasoning Level</span>
            <span className="font-bold text-[var(--nc-text-primary)]">{selectedModel.reasoningScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-[var(--nc-surface-3)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--nc-accent), var(--nc-info))',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${selectedModel.reasoningScore}%` }}
              transition={{ delay: 0.1, duration: 0.8 }}
              key={`reasoning-${selectedModel.id}`}
            />
          </div>
        </div>

        {/* Coding Progress */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="text-[var(--nc-text-secondary)] font-medium">Coding Level</span>
            <span className="font-bold text-[var(--nc-text-primary)]">{selectedModel.codingScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-[var(--nc-surface-3)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--nc-info), var(--nc-success))',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${selectedModel.codingScore}%` }}
              transition={{ delay: 0.2, duration: 0.8 }}
              key={`coding-${selectedModel.id}`}
            />
          </div>
        </div>
      </div>

      {/* Strengths Chips */}
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--nc-text-muted)]">
          Strengths
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selectedModel.strengths.map((strength) => (
            <span
              key={strength}
              className="rounded-full px-2.5 py-0.5 text-[10px] font-medium text-[var(--nc-accent)] bg-[var(--nc-accent-dim)] border border-[var(--nc-accent)]/20 shadow-[0_0_8px_rgba(124,106,255,0.08)]"
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full" style={{ background: 'var(--nc-border)' }} />

      {/* Configurations */}
      <div className="flex flex-col gap-4">
        {/* Temperature Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="temperature-slider"
              className="text-[12px] font-medium text-[var(--nc-text-secondary)]"
            >
              Temperature
            </label>
            <span className="text-[12px] font-bold text-[var(--nc-text-primary)]">
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
            className="nc-slider w-full"
          />
        </div>

        {/* Max Tokens Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="max-tokens-slider"
              className="text-[12px] font-medium text-[var(--nc-text-secondary)]"
            >
              Max Tokens
            </label>
            <span className="text-[12px] font-bold text-[var(--nc-text-primary)]">
              {maxTokens.toLocaleString()}
            </span>
          </div>
          <input
            id="max-tokens-slider"
            type="range"
            min={256}
            max={selectedModel.contextWindow}
            step={256}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            className="nc-slider w-full"
          />
        </div>
      </div>
    </div>
  )
}
