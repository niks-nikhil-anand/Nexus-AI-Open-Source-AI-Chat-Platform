'use client'

import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react'
import type { ChatState, ChatAction, Conversation, Message } from './types'
import { mockModels, mockConversations } from './mock-data'
import { applyTheme, saveTheme, getInitialTheme } from './theme'

// ─── Mock Responses ───────────────────────────────────────────────────────────

const mockResponses: string[] = [
  'That\'s a great question. Let me break this down step by step so we can understand the core mechanics at play here and find the most effective approach for your use case.',
  'I\'d recommend starting with a simpler approach first. You can always iterate and add complexity later once the foundation is solid and well-tested across different scenarios.',
  'Here\'s how I would think about this problem: first identify the constraints, then explore the solution space within those boundaries. This keeps the scope manageable and the results predictable.',
  'The key insight here is that these systems are fundamentally compositional. Each piece works independently, but the real power comes from how they interact and build on each other.',
  'Based on the patterns I\'ve seen, the most maintainable solution involves separating the concerns clearly. This makes each part testable in isolation and easier to reason about as the system grows.',
  'Good instinct on that approach. One thing to watch out for is the interaction between these layers — making sure the abstractions don\'t leak and each boundary is well-defined will save time later.',
]

let responseIndex = 0

function getNextMockResponse(): string {
  const response = mockResponses[responseIndex % mockResponses.length]
  responseIndex++
  return response
}

// ─── Initial State ────────────────────────────────────────────────────────────

function createInitialState(): ChatState {
  return {
    conversations: mockConversations,
    activeConversationId: mockConversations.length > 0 ? mockConversations[0].id : null,
    selectedModel: mockModels[0],
    isGenerating: false,
    leftSidebarOpen: true,
    rightPanelOpen: false,
    theme: getInitialTheme(),
    commandPaletteOpen: false,
    settingsOpen: false,
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SEND_MESSAGE': {
      const { content } = action.payload
      const userMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        role: 'user',
        content,
        timestamp: new Date(),
      }

      if (state.activeConversationId) {
        return {
          ...state,
          conversations: state.conversations.map((conv) =>
            conv.id === state.activeConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, userMessage],
                  updatedAt: new Date(),
                }
              : conv
          ),
        }
      }

      // No active conversation — create a new one
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
        messages: [userMessage],
        modelId: state.selectedModel.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
      }

      return {
        ...state,
        conversations: [newConv, ...state.conversations],
        activeConversationId: newConv.id,
      }
    }

    case 'APPEND_TOKEN': {
      const { token } = action.payload
      if (!state.activeConversationId) return state

      return {
        ...state,
        conversations: state.conversations.map((conv) => {
          if (conv.id !== state.activeConversationId) return conv

          const messages = [...conv.messages]
          const lastMessage = messages[messages.length - 1]

          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
            // Append token to existing streaming message
            messages[messages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + token,
            }
          } else {
            // Create a new assistant message with streaming flag
            messages.push({
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              role: 'assistant',
              content: token,
              timestamp: new Date(),
              isStreaming: true,
            })
          }

          return { ...conv, messages, updatedAt: new Date() }
        }),
      }
    }

    case 'FINALIZE_RESPONSE': {
      if (!state.activeConversationId) return state

      return {
        ...state,
        isGenerating: false,
        conversations: state.conversations.map((conv) => {
          if (conv.id !== state.activeConversationId) return conv

          const messages = [...conv.messages]
          const lastMessage = messages[messages.length - 1]

          if (lastMessage && lastMessage.role === 'assistant') {
            messages[messages.length - 1] = {
              ...lastMessage,
              isStreaming: false,
            }
          }

          return { ...conv, messages }
        }),
      }
    }

    case 'SET_MODEL': {
      return { ...state, selectedModel: action.payload }
    }

    case 'NEW_CONVERSATION': {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        title: 'New Conversation',
        messages: [],
        modelId: state.selectedModel.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
      }

      return {
        ...state,
        conversations: [newConv, ...state.conversations],
        activeConversationId: newConv.id,
      }
    }

    case 'SELECT_CONVERSATION': {
      return { ...state, activeConversationId: action.payload.id }
    }

    case 'DELETE_CONVERSATION': {
      const { id } = action.payload
      const filtered = state.conversations.filter((c) => c.id !== id)
      return {
        ...state,
        conversations: filtered,
        activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
      }
    }

    case 'PIN_CONVERSATION': {
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === action.payload.id ? { ...conv, isPinned: !conv.isPinned } : conv
        ),
      }
    }

    case 'TOGGLE_LEFT_SIDEBAR': {
      return { ...state, leftSidebarOpen: !state.leftSidebarOpen }
    }

    case 'TOGGLE_RIGHT_PANEL': {
      return { ...state, rightPanelOpen: !state.rightPanelOpen }
    }

    case 'SET_THEME': {
      const theme = action.payload
      applyTheme(theme)
      saveTheme(theme)
      return { ...state, theme }
    }

    case 'TOGGLE_COMMAND_PALETTE': {
      return { ...state, commandPaletteOpen: !state.commandPaletteOpen }
    }

    case 'TOGGLE_SETTINGS': {
      return { ...state, settingsOpen: !state.settingsOpen }
    }

    case 'SET_GENERATING': {
      return { ...state, isGenerating: action.payload }
    }

    default:
      return state
  }
}

// ─── Simulate Streaming ───────────────────────────────────────────────────────

export function simulateStreaming(
  dispatch: React.Dispatch<ChatAction>,
  response: string
): () => void {
  const timeouts: ReturnType<typeof setTimeout>[] = []

  // Dispatch an initial empty assistant message with isStreaming: true
  timeouts.push(
    setTimeout(() => {
      dispatch({ type: 'APPEND_TOKEN', payload: { token: '' } })
    }, 0)
  )

  // Dispatch each character with a ~30ms delay
  for (let i = 0; i < response.length; i++) {
    timeouts.push(
      setTimeout(() => {
        dispatch({ type: 'APPEND_TOKEN', payload: { token: response[i] } })
      }, 30 * (i + 1))
    )
  }

  // Finalize after all tokens
  timeouts.push(
    setTimeout(() => {
      dispatch({ type: 'FINALIZE_RESPONSE' })
    }, 30 * (response.length + 1))
  )

  // Return cleanup function
  return () => {
    timeouts.forEach(clearTimeout)
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ChatContextValue {
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
  sendMessage: (content: string) => void
  activeConversation: Conversation | null
  activeMessages: Message[]
}

const ChatContext = createContext<ChatContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, undefined, createInitialState)
  const cleanupRef = useRef<(() => void) | null>(null)

  // Apply theme on mount
  useEffect(() => {
    applyTheme(state.theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      // Cancel any in-progress streaming
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }

      // Dispatch the user message
      dispatch({ type: 'SEND_MESSAGE', payload: { content } })

      // Mark as generating
      dispatch({ type: 'SET_GENERATING', payload: true })

      // Pick a mock response
      const response = getNextMockResponse()

      // Start streaming the response
      cleanupRef.current = simulateStreaming(dispatch, response)
    },
    []
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [])

  const activeConversation =
    state.conversations.find((c) => c.id === state.activeConversationId) ?? null

  const activeMessages = activeConversation?.messages ?? []

  const value: ChatContextValue = {
    state,
    dispatch,
    sendMessage,
    activeConversation,
    activeMessages,
  }

  return React.createElement(ChatContext.Provider, { value }, children)
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────

export function useChatStore(): ChatContextValue {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatStore must be used within a ChatProvider')
  }
  return context
}
