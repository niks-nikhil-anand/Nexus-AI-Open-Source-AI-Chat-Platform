'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { WelcomeScreen } from '@/components/chat/WelcomeScreen'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import { WaveformBar } from '@/components/chat/WaveformBar'
import ModelSelector from '@/components/overlays/ModelSelector'
import { useChatStore } from '@/lib/store'

export default function Home() {
  const { activeConversation, activeMessages, state, dispatch } = useChatStore()
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)

  return (
    <AppShell>
      {activeConversation ? (
        <div className="relative flex flex-1 flex-col min-h-0">
          {/* Header with model selector */}
          <div className="relative">
            <ChatHeader onModelSelectorOpen={() => setModelSelectorOpen(true)} />
            <ModelSelector
              isOpen={modelSelectorOpen}
              onClose={() => setModelSelectorOpen(false)}
              onSelect={(model) => {
                dispatch({ type: 'SET_MODEL', payload: model })
                setModelSelectorOpen(false)
              }}
              currentModelId={state.selectedModel.id}
            />
          </div>
          <MessageList messages={activeMessages} isGenerating={state.isGenerating} />
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none flex flex-col items-center pb-6 z-10">
            <div className="w-full max-w-2xl px-4 pointer-events-auto flex flex-col gap-2">
              {state.isGenerating && <WaveformBar />}
              <ChatInput />
            </div>
          </div>
        </div>
      ) : (
        <WelcomeScreen />
      )}
    </AppShell>
  )
}
