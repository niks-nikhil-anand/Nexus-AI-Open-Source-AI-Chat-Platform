'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useChatStore } from '@/lib/store'

function formatContextWindow(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`
  }
  return `${Math.round(value / 1000)}K`
}

export function RightPanel() {
  const { state } = useChatStore()
  const { selectedModel } = state

  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)

  return (
    <div
      className="h-full overflow-y-auto p-4"
      style={{ background: 'var(--nc-surface-1)' }}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--nc-text-muted)]">
          Model Details
        </h2>
      </div>

      {/* Model Card Header */}
      <div className="mb-3">
        <div className="font-[var(--font-dm-sans)] text-[17px] font-semibold text-[var(--nc-text-primary)]">
          {selectedModel.name}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: selectedModel.providerColor }}
          />
          <span className="text-[12px] text-[var(--nc-text-secondary)]">
            {selectedModel.provider}
          </span>
        </div>
      </div>

      {/* New Badge */}
      {selectedModel.isNew && (
        <div className="mb-3">
          <span
            className="inline-block rounded-md px-2 py-0.5 text-[11px] font-medium text-[var(--nc-accent)]"
            style={{
              background: 'linear-gradient(135deg, var(--nc-accent-dim), color-mix(in srgb, var(--nc-info) 78%, transparent))',
            }}
          >
            New ↗
          </span>
        </div>
      )}

      {/* Description */}
      <p className="mb-4 text-[12px] leading-relaxed text-[var(--nc-text-secondary)]">
        {selectedModel.description}
      </p>

      {/* Stat Grid 2x2 */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-[10px] p-3" style={{ background: 'var(--nc-surface-2)' }}>
          <div className="text-[11px] text-[var(--nc-text-muted)]">Context</div>
          <div className="text-[13px] font-semibold text-[var(--nc-text-primary)]">
            {formatContextWindow(selectedModel.contextWindow)}
          </div>
        </div>
        <div className="rounded-[10px] p-3" style={{ background: 'var(--nc-surface-2)' }}>
          <div className="text-[11px] text-[var(--nc-text-muted)]">Params</div>
          <div className="text-[13px] font-semibold text-[var(--nc-text-primary)]">
            {selectedModel.parameters}
          </div>
        </div>
        <div className="rounded-[10px] p-3" style={{ background: 'var(--nc-surface-2)' }}>
          <div className="text-[11px] text-[var(--nc-text-muted)]">Reasoning</div>
          <div className="text-[13px] font-semibold text-[var(--nc-text-primary)]">
            {selectedModel.reasoningScore}%
          </div>
        </div>
        <div className="rounded-[10px] p-3" style={{ background: 'var(--nc-surface-2)' }}>
          <div className="text-[11px] text-[var(--nc-text-muted)]">Code</div>
          <div className="text-[13px] font-semibold text-[var(--nc-text-primary)]">
            {selectedModel.codingScore}%
          </div>
        </div>
      </div>

      {/* Strengths Chips */}
      <div className="mb-4">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--nc-text-muted)]">
          Strengths
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selectedModel.strengths.map((strength) => (
            <span
              key={strength}
              className="rounded-[6px] px-2 py-0.5 text-[11px] text-[var(--nc-text-secondary)]"
              style={{ background: 'var(--nc-surface-3)' }}
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      {/* Coding Score Bar */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-[var(--nc-text-muted)]">Coding Score</span>
          <span className="text-[11px] font-semibold text-[var(--nc-text-primary)]">
            {selectedModel.codingScore}%
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: 'var(--nc-surface-3)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, var(--nc-accent), var(--nc-info))',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${selectedModel.codingScore}%` }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            key={selectedModel.id}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full" style={{ background: 'var(--nc-border)' }} />

      {/* Temperature Slider */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="temperature-slider"
            className="text-[12px] font-medium text-[var(--nc-text-secondary)]"
          >
            Temperature
          </label>
          <span className="text-[12px] font-semibold text-[var(--nc-text-primary)]">
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

      {/* Max Tokens Input */}
      <div className="mb-4">
        <label
          htmlFor="max-tokens-input"
          className="mb-2 block text-[12px] font-medium text-[var(--nc-text-secondary)]"
        >
          Max Tokens
        </label>
        <input
          id="max-tokens-input"
          type="number"
          min={1}
          max={128000}
          value={maxTokens}
          onChange={(e) => setMaxTokens(Number(e.target.value))}
          className="w-full rounded-[10px] border border-[var(--nc-border)] px-3 py-2 text-[13px] text-[var(--nc-text-primary)] outline-none focus:border-[var(--nc-accent)]"
          style={{ background: 'var(--nc-surface-2)' }}
        />
      </div>
    </div>
  )
}
