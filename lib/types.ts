// NeuraChat type definitions

export type ModelProvider =
  | 'OpenAI'
  | 'NVIDIA'
  | 'Mistral'
  | 'Alibaba'
  | 'DeepSeek'
  | 'Google'
  | 'Anthropic'
  | 'MiniMax'
  | 'Microsoft'
  | 'Meta'
  | 'StepFun'
  | 'Moonshot'
  | 'ByteDance'

export interface AIModel {
  id: string
  name: string
  provider: ModelProvider
  description: string
  contextWindow: number
  parameters: string
  reasoningScore: number
  codingScore: number
  strengths: string[]
  providerColor: string
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
}

export type ChatAction =
  | { type: 'SEND_MESSAGE'; payload: { content: string } }
  | { type: 'APPEND_TOKEN'; payload: { token: string } }
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
