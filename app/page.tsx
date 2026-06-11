'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { WelcomeScreen } from '@/components/chat/WelcomeScreen'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageList } from '@/components/chat/MessageList'
import { WaveformBar } from '@/components/chat/WaveformBar'
import { ChatInput } from '@/components/chat/ChatInput'
import ModelSelector from '@/components/overlays/ModelSelector'
import { useChatStore } from '@/lib/store'

export default function Home() {
  const { activeConversation, activeMessages, state, dispatch } = useChatStore()
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)

  return (
    <AppShell>
      {activeConversation ? (
        <div className="flex flex-1 flex-col min-h-0">
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
          <div className="shrink-0 px-4 pb-4">
            <WaveformBar />
            <ChatInput />
          </div>
        </div>
      ) : (
        <WelcomeScreen />
      )}
    </AppShell>
  )
}
