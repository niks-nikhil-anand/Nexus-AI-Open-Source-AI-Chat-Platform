'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useChatStore } from '@/lib/store'
import { mockModels } from '@/lib/mock-data'
import { springs } from '@/lib/animations'

const chipModels = mockModels.slice(0, 4)

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
}

const chipVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

export function WelcomeScreen() {
  const { dispatch } = useChatStore()

  function handleModelClick(modelId: string) {
    const model = mockModels.find((m) => m.id === modelId)
    if (model) {
      dispatch({ type: 'SET_MODEL', payload: model })
      dispatch({ type: 'NEW_CONVERSATION' })
    }
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle, var(--nc-text-muted) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'center',
          opacity: 0.04,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springs.message, delay: 0 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[var(--nc-accent)] opacity-20 blur-2xl rounded-full scale-75" />
          <Image
            src="/logo2.png"
            alt="NeuraChat Logo"
            width={108}
            height={108}
            className="relative rounded-2xl object-contain shadow-2xl"
            priority
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-[var(--font-dm-sans)] text-[2.5rem] font-semibold text-[var(--nc-text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.message, delay: 0.05 }}
        >
          NeuraChat
        </motion.h1>

        {/* Accent line */}
        <motion.div
          className="h-px w-10"
          style={{ backgroundColor: 'var(--nc-accent)' }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ ...springs.message, delay: 0.1 }}
        />

        {/* Subtitle */}
        <motion.p
          className="text-center text-[1.0625rem] text-[var(--nc-text-secondary)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.message, delay: 0.15 }}
        >
          Talk to every frontier model from one place.
        </motion.p>

        {/* Model chips */}
        <motion.div
          className="mt-4 flex flex-wrap justify-center gap-3"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {chipModels.map((model, idx) => (
            <motion.button
              key={model.id}
              type="button"
              onClick={() => handleModelClick(model.id)}
              className="cursor-pointer rounded-[6px] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--nc-accent-dim)]"
              style={{
                backgroundColor: 'var(--nc-surface-3)',
                color: 'var(--nc-text-secondary)',
                animation: `welcomeFloat 3s ease-in-out ${idx * 0.3}s infinite`,
              }}
              variants={chipVariants}
              transition={springs.micro}
              whileHover={{ scale: 1.05 }}
              aria-label={`Start conversation with ${model.name}`}
            >
              {model.name}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Float keyframes */}
      <style>{`
        @keyframes welcomeFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  )
}
