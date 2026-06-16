'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useChatStore } from '@/lib/store'
import { aiModels } from '@/lib/ai-models'
import { springs } from '@/lib/animations'

const chipModels = aiModels.slice(0, 4)

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
    const model = aiModels.find((m) => m.id === modelId)
    if (model) {
      dispatch({ type: 'SET_MODEL', payload: model })
      dispatch({ type: 'NEW_CONVERSATION' })
    }
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 bg-devkit-bg">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 hero-bg-dots"
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
          <div className="absolute inset-0 bg-devkit-accent opacity-20 blur-2xl rounded-full scale-75" />
          <Image
            src="/logo2.png"
            alt="NeuraChat Logo"
            width={108}
            height={108}
            className="relative rounded-lg-devkit object-contain shadow-2xl border border-devkit-bg-muted"
            priority
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-devkit-text bg-gradient-to-r from-devkit-text via-[#a89ef9] to-devkit-accent bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.message, delay: 0.05 }}
        >
          NeuraChat
        </motion.h1>

        {/* Accent line */}
        <motion.div
          className="h-[2px] w-12 rounded bg-gradient-to-r from-devkit-accent to-devkit-accent-secondary"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ ...springs.message, delay: 0.1 }}
        />

        {/* Subtitle */}
        <motion.p
          className="text-center text-sm sm:text-base text-devkit-text-secondary max-w-md font-sans"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.message, delay: 0.15 }}
        >
          Talk to every frontier model from one place.
        </motion.p>

        {/* Model chips */}
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-3"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {chipModels.map((model, idx) => (
            <motion.button
              key={model.id}
              type="button"
              onClick={() => handleModelClick(model.id)}
              className="cursor-pointer rounded-devkit border border-devkit-bg-muted bg-devkit-bg-subtle/80 hover:bg-devkit-bg-subtle hover:border-devkit-accent text-devkit-text-secondary hover:text-devkit-text text-xs sm:text-sm font-semibold px-4 py-2.5 transition-all shadow-sm hover:shadow-md"
              style={{
                animation: `welcomeFloat 3s ease-in-out ${idx * 0.3}s infinite`,
              }}
              variants={chipVariants}
              transition={springs.micro}
              whileHover={{ scale: 1.03 }}
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
