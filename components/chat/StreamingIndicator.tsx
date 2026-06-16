'use client'

import { motion } from 'framer-motion'

interface StreamingIndicatorProps {
  stage: 'thinking' | 'streaming' | 'complete'
}

export function StreamingIndicator({ stage }: StreamingIndicatorProps) {
  if (stage === 'complete') return null

  const label = stage === 'thinking' ? 'Thinking...' : 'Generating...'

  return (
    <div className="flex items-center gap-2 pl-1" role="status" aria-label={label}>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block rounded-full"
            style={{
              width: 6,
              height: 6,
              backgroundColor: 'var(--devkit-accent)',
              opacity: 0.7,
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span
        className="text-xs font-sans"
        style={{ color: 'var(--devkit-text-secondary)' }}
      >
        {label}
      </span>
    </div>
  )
}
