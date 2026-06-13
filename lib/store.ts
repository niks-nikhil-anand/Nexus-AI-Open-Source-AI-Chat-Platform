'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react'
import type { ChatState, ChatAction, Conversation, Message } from './types'
import { mockModels, mockConversations } from './mock-data'
import { applyTheme, saveTheme, getInitialTheme } from './theme'

type ChatApiResponse = {
  content?: string
  error?: string
}

// ─── Initial State ────────────────────────────────────────────────────────────

function createInitialState(): ChatState {
  return {
    conversations: [],
    activeConversationId: null,
    selectedModel: mockModels[0],
    isGenerating: false,
    leftSidebarOpen: true,
    rightPanelOpen: false,
    theme: getInitialTheme(),
    commandPaletteOpen: false,
    settingsOpen: false,
    temperature: 1.00,
    top_p: 0.95,
    max_tokens: 4096,
    enable_thinking: false,
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SEND_MESSAGE': {
      const { content, chatId } = action.payload
      const userMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        role: 'user',
        content,
        timestamp: new Date(),
        modelId: state.selectedModel.id,
        tokens: Math.max(1, Math.round(content.length / 4.2)),
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

      // No active conversation locally but we received a real chatId from API creation
      const newConv: Conversation = {
        id: chatId || `conv-${Date.now()}`,
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
      const { token, timeToFirstTokenMs } = action.payload
      if (!state.activeConversationId) return state

      return {
        ...state,
        conversations: state.conversations.map((conv) => {
          if (conv.id !== state.activeConversationId) return conv

          const messages = [...conv.messages]
          const lastMessage = messages[messages.length - 1]

          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
            // Append token to existing streaming message
            const updatedContent = lastMessage.content + token
            messages[messages.length - 1] = {
              ...lastMessage,
              content: updatedContent,
              tokens: Math.max(1, Math.round(updatedContent.length / 4.2)),
            }
          } else {
            // Create a new assistant message with streaming flag
            messages.push({
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              role: 'assistant',
              content: token,
              timestamp: new Date(),
              isStreaming: true,
              modelId: state.selectedModel.id,
              tokens: Math.max(1, Math.round(token.length / 4.2)),
              timeToFirstTokenMs,
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
      const model = action.payload
      const contextWindow = model.contextWindow ?? 4096
      const max_tokens = state.max_tokens > contextWindow ? contextWindow : state.max_tokens
      return { ...state, selectedModel: model, max_tokens }
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

    case 'SET_TEMPERATURE': {
      return { ...state, temperature: action.payload }
    }

    case 'SET_TOP_P': {
      return { ...state, top_p: action.payload }
    }

    case 'SET_MAX_TOKENS': {
      return { ...state, max_tokens: action.payload }
    }

    case 'SET_THINKING': {
      return { ...state, enable_thinking: action.payload }
    }

    case 'SET_CONVERSATIONS': {
      return { ...state, conversations: action.payload, activeConversationId: action.payload.length > 0 && !state.activeConversationId ? action.payload[0].id : state.activeConversationId }
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
  stopGeneration: () => void
  activeConversation: Conversation | null
  activeMessages: Message[]
}

const ChatContext = createContext<ChatContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, undefined, createInitialState)
  const cleanupRef = useRef<(() => void) | null>(null)

  // Apply theme and fetch chats on mount
  useEffect(() => {
    applyTheme(state.theme)
    fetch('/api/chats')
      .then(res => res.json())
      .then(data => {
        if (data.chats) {
          const loadedChats = data.chats.map((c: any) => ({
            id: c.id,
            title: c.title,
            messages: c.messages?.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.createdAt),
              modelId: state.selectedModel.id,
              tokens: Math.max(1, Math.round(m.content.length / 4.2))
            })) || [],
            modelId: state.selectedModel.id,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt),
            isPinned: false
          }))
          dispatch({ type: 'SET_CONVERSATIONS', payload: loadedChats })
        }
      })
      .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeConversation =
    state.conversations.find((c) => c.id === state.activeConversationId) ?? null

  const activeMessages = useMemo(
    () => activeConversation?.messages ?? [],
    [activeConversation?.messages]
  )

  const sendMessage = useCallback(
    async (content: string) => {
      // Cancel any in-progress streaming
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }

      let currentChatId = state.activeConversationId
      
      if (!currentChatId || currentChatId.startsWith('conv-')) {
        try {
          const res = await fetch('/api/chats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              title: content.slice(0, 40) || 'New Chat',
              id: currentChatId || undefined
            })
          });
          const data = await res.json();
          if (data.chat) {
            currentChatId = data.chat.id;
          }
        } catch (e) {
          console.error("Failed to create chat", e);
        }
      }

      // Dispatch the user message
      dispatch({ type: 'SEND_MESSAGE', payload: { content, chatId: currentChatId || undefined } })

      // Mark as generating
      dispatch({ type: 'SET_GENERATING', payload: true })

      const apiMessages = [...activeMessages, { role: 'user' as const, content }].map((message) => ({
        role: message.role,
        content: message.content,
      }))

      const abortController = new AbortController()
      cleanupRef.current = () => {
        abortController.abort()
      }

      const startTime = Date.now()
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
          body: JSON.stringify({
            chatId: currentChatId,
            model: state.selectedModel.id,
            messages: apiMessages,
            max_tokens: state.max_tokens,
            temperature: state.temperature,
            top_p: state.top_p,
            stream: true,
            chat_template_kwargs: {
              enable_thinking: state.enable_thinking,
            },
          }),
        })

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as ChatApiResponse
          throw new Error(data.error ?? 'The chat request failed.')
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('Response body is not readable.')
        }

        const decoder = new TextDecoder()

        // Dispatch an initial empty assistant message with isStreaming: true
        const timeToFirstTokenMs = Date.now() - startTime
        dispatch({ type: 'APPEND_TOKEN', payload: { token: '', timeToFirstTokenMs } })

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const token = decoder.decode(value, { stream: true })
          dispatch({ type: 'APPEND_TOKEN', payload: { token } })
        }

        dispatch({ type: 'FINALIZE_RESPONSE' })
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Stream was cancelled, finalize the response to keep whatever we have received so far
          dispatch({ type: 'FINALIZE_RESPONSE' })
          return
        }
        const message = error instanceof Error ? error.message : 'Unable to reach the chat API.'
        dispatch({ type: 'APPEND_TOKEN', payload: { token: message } })
        dispatch({ type: 'FINALIZE_RESPONSE' })
      } finally {
        cleanupRef.current = null
      }
    },
    [activeMessages, state.selectedModel.id]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [])

  const stopGeneration = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
  }, [])

  const value: ChatContextValue = {
    state,
    dispatch,
    sendMessage,
    stopGeneration,
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
