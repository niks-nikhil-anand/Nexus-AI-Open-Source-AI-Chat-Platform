// NeuraChat type definitions

export type ModelProvider = 'nvidia' | 'openrouter'

export interface AIModel {
  id: string
  name: string
  provider: ModelProvider
  description: string
  status: 'free' | 'paid'
  contextWindow?: number
  parameters?: string
  reasoningScore?: number
  codingScore?: number
  strengths?: string[]
  providerColor?: string
  isNew?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  modelId: string
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
  modelId?: string
  tokens?: number
  timeToFirstTokenMs?: number
}

export interface ThemeTokens {
  void: string
  surface1: string
  surface2: string
  surface3: string
  border: string
  accent: string
  accentHover: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  userBubble: string
  success: string
  warning: string
  error: string
}

export interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  selectedModel: AIModel
  isGenerating: boolean
  leftSidebarOpen: boolean
  rightPanelOpen: boolean
  theme: 'dark' | 'light'
  commandPaletteOpen: boolean
  settingsOpen: boolean
  temperature: number
  top_p: number
  max_tokens: number
  enable_thinking: boolean
}

export type ChatAction =
  | { type: 'SEND_MESSAGE'; payload: { content: string; chatId?: string } }
  | { type: 'APPEND_TOKEN'; payload: { token: string; timeToFirstTokenMs?: number } }
  | { type: 'FINALIZE_RESPONSE' }
  | { type: 'SET_MODEL'; payload: AIModel }
  | { type: 'NEW_CONVERSATION' }
  | { type: 'SELECT_CONVERSATION'; payload: { id: string } }
  | { type: 'DELETE_CONVERSATION'; payload: { id: string } }
  | { type: 'PIN_CONVERSATION'; payload: { id: string } }
  | { type: 'TOGGLE_LEFT_SIDEBAR' }
  | { type: 'TOGGLE_RIGHT_PANEL' }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' }
  | { type: 'TOGGLE_COMMAND_PALETTE' }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_TEMPERATURE'; payload: number }
  | { type: 'SET_TOP_P'; payload: number }
  | { type: 'SET_MAX_TOKENS'; payload: number }
  | { type: 'SET_THINKING'; payload: boolean }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
