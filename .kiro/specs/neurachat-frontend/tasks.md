# Implementation Plan: NeuraChat Frontend

## Overview

Build a premium multi-model AI chat frontend with "deep space workbench" aesthetic using Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Radix UI, and shadcn. Implementation follows a bottom-up approach: types/data → state management → layout shell → core components → overlays → polish.

## Tasks

- [x] 1. Set up project foundation and design system
  - [x] 1.1 Install framer-motion and configure dependencies
    - Run `npm install framer-motion`
    - Verify all dependencies are available
    - _Requirements: 12.1_

  - [x] 1.2 Create type definitions and mock data
    - Create `lib/types.ts` with all interfaces: AIModel, ModelProvider, Conversation, Message, ThemeTokens, ChatState, ChatAction
    - Create `lib/mock-data.ts` with 7+ mock AI models (GPT-4o, Claude 3.5, Gemini Pro, DeepSeek V3, Mistral Large, Qwen 2.5, Llama 3.1) and 5+ mock conversations with messages
    - _Requirements: 1.1, 3.1_

  - [x] 1.3 Create theme system with CSS custom properties
    - Create `lib/theme.ts` with dark and light ThemeTokens objects
    - Define CSS custom properties in `app/globals.css` for all theme tokens
    - Implement `applyTheme()` utility that sets CSS variables on document root
    - Include the cold indigo-violet accent (#7C6AFF dark, #6355E8 light)
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.4 Create animation presets and shared utilities
    - Create `lib/animations.ts` with spring presets (panel, popup, message, micro, wave)
    - Export Framer Motion variant objects: messageVariants, sidebarVariants, paletteVariants, dropdownVariants
    - Create `lib/utils.ts` additions for date grouping helper
    - _Requirements: 12.1_

- [x] 2. Implement state management (ChatStore)
  - [x] 2.1 Create chatReducer and ChatStore context
    - Create `lib/store.ts` with chatReducer handling all ChatAction types
    - Implement ChatProvider component with React Context + useReducer
    - Implement sendMessage helper that dispatches SEND_MESSAGE and triggers simulateStreaming
    - Implement simulateStreaming with setTimeout-based token dispatch
    - Handle localStorage persistence for theme (with try/catch fallback)
    - Expose context value: state, dispatch, sendMessage, activeConversation, activeMessages
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 1.4, 1.5, 1.6_

  - [ ]* 2.2 Write property test: Reducer Immutability
    - **Property 1: Reducer Immutability**
    - Generate random valid ChatState and ChatAction combinations
    - Verify original state is not mutated and unaffected fields are preserved
    - **Validates: Requirements 3.2, 3.3**

  - [ ]* 2.3 Write property test: Model Selection Invariant
    - **Property 6: Model Selection Invariant**
    - Generate random states and SET_MODEL actions with valid AIModel payloads
    - Verify selectedModel equals payload and all other fields unchanged
    - **Validates: Requirements 3.2, 3.3**

  - [ ]* 2.4 Write property test: Streaming Token Fidelity
    - **Property 4: Streaming Token Fidelity**
    - Generate random non-empty strings, run simulateStreaming, collect all APPEND_TOKEN payloads
    - Verify concatenation equals original string
    - **Validates: Requirements 4.3, 4.5**

  - [ ]* 2.5 Write property test: Message Ordering Preservation
    - **Property 3: Message Ordering Preservation**
    - Generate random sequences of SEND_MESSAGE actions
    - Verify resulting messages maintain chronological timestamp order
    - **Validates: Requirements 5.6**

- [x] 3. Implement groupConversationsByDate utility
  - [x] 3.1 Create date grouping function
    - Create `lib/group-conversations.ts` with groupConversationsByDate
    - Group into: Today, Yesterday, Previous 7 Days, Older
    - Sort conversations within each group by updatedAt descending
    - Exclude empty groups from result
    - _Requirements: 7.2, 7.3_

  - [ ]* 3.2 Write property test: Conversation Grouping Completeness
    - **Property 2: Conversation Grouping Completeness**
    - Generate random arrays of conversations with various dates
    - Verify each conversation appears in exactly one group, totals match, empty groups excluded
    - **Validates: Requirements 7.2, 7.3**

- [x] 4. Checkpoint - Core logic tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Build application shell and layout
  - [x] 5.1 Create root layout with ThemeProvider and fonts
    - Update `app/layout.tsx` with ChatProvider wrapping, font setup (Inter/JetBrains Mono or similar), and HTML structure
    - Apply theme CSS variables to document root
    - _Requirements: 1.2, 1.3, 1.6_

  - [x] 5.2 Create three-column responsive layout
    - Create `components/layout/AppShell.tsx` with flex layout: LeftSidebar | MainArea | RightPanel
    - Implement responsive breakpoints: desktop (≥1024px), tablet (768-1023px), mobile (<768px)
    - Desktop: 260px | flex | 300px; Tablet: 72px | flex | hidden; Mobile: drawer | flex | hidden
    - Use Framer Motion for sidebar/panel toggle animations
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 5.3 Implement the main page
    - Update `app/page.tsx` to render AppShell with conditional WelcomeScreen or Chat view based on activeConversation
    - _Requirements: 2.1_

- [x] 6. Implement main chat area components
  - [x] 6.1 Create ChatHeader component
    - Create `components/chat/ChatHeader.tsx` displaying current model name as clickable trigger for ModelSelector
    - Show model provider badge and conversation title
    - Include toggle button for RightPanel
    - _Requirements: 9.1, 8.7_

  - [x] 6.2 Create WaveformBar component
    - Create `components/chat/WaveformBar.tsx` with HTML5 Canvas
    - Implement drawWaveform with 48 bars, accent color
    - Idle mode: sine wave with slow pulse; Generating mode: noise-driven oscillation
    - Smooth interpolation between modes
    - Use requestAnimationFrame loop
    - Implement static gradient fallback when canvas unavailable
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 6.3 Create MessageList and MessageBubble components
    - Create `components/chat/MessageList.tsx` with scrollable message area
    - Create `components/chat/MessageBubble.tsx` for individual messages
    - User messages: right-aligned, max 70% width, bubble styling
    - Assistant messages: full-width, flush left, no bubble
    - Staggered entrance animations (fadeUp + blur) using Framer Motion
    - Auto-scroll to bottom on new messages
    - Streaming indicator (thinking → streaming → complete)
    - Hover toolbar (copy, regenerate icons)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 12.2_

  - [x] 6.4 Create ChatInput component
    - Create `components/chat/ChatInput.tsx` with auto-resize textarea
    - Enter to send, Shift+Enter for newline
    - Send button with animated state (idle, sending)
    - Disabled state when isGenerating is true
    - Auto-focus on mount and after send
    - Max height 200px with overflow scroll
    - _Requirements: 4.7, 4.8, 13.2, 13.3_

  - [x] 6.5 Create WelcomeScreen component
    - Create `components/chat/WelcomeScreen.tsx` shown when no conversation is active
    - Display greeting, model info, and quick action suggestions
    - _Requirements: 2.1_

- [x] 7. Implement LeftSidebar
  - [x] 7.1 Create LeftSidebar component
    - Create `components/sidebar/LeftSidebar.tsx` with full structure
    - Logo/brand area at top
    - New Chat button
    - ⌘K search trigger button
    - Pinned conversations section
    - Recent conversations grouped by date using groupConversationsByDate
    - Theme toggle (dark/light icon button)
    - User profile display at bottom
    - _Requirements: 7.1, 7.4, 7.5, 7.6, 7.7, 7.8_

  - [x] 7.2 Create ConversationItem component
    - Create `components/sidebar/ConversationItem.tsx`
    - Display conversation title with model indicator
    - Active state styling
    - Hover actions: pin, delete
    - Collapsed (icon-only) variant for 72px mode
    - _Requirements: 7.4, 7.5, 7.6_

  - [x] 7.3 Implement sidebar responsive behavior
    - Desktop: 260px expanded with all content
    - Tablet: 72px icon-only (collapse labels, show only icons)
    - Mobile: Drawer overlay with backdrop, triggered by hamburger menu
    - Framer Motion spring animation for collapse/expand
    - _Requirements: 2.2, 2.3, 2.4_

- [x] 8. Implement RightPanel (Model Panel)
  - [x] 8.1 Create RightPanel component
    - Create `components/panel/RightPanel.tsx` with model details
    - Model name, provider badge (colored), description
    - 2×2 stat grid: context window, parameters, reasoning score, coding score
    - Strengths displayed as styled chips
    - Animated progress bar for coding score (Framer Motion)
    - Temperature slider (0-2 range, step 0.1)
    - Max tokens numeric input
    - Spring animation for panel show/hide
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 2.5_

- [x] 9. Checkpoint - Core UI components complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement overlay components
  - [x] 10.1 Create ModelSelector dropdown
    - Create `components/overlays/ModelSelector.tsx`
    - Spring-animated dropdown from header trigger
    - Models grouped by provider with colored indicator dots
    - Live search/filter input at top
    - Keyboard navigation (arrow keys, enter to select, esc to close)
    - Glassmorphism styling (backdrop-blur, border, shadow)
    - Close on selection or outside click
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 12.3_

  - [x] 10.2 Create CommandPalette overlay
    - Create `components/overlays/CommandPalette.tsx`
    - Full-screen overlay with backdrop blur
    - Center-positioned panel with spring animation (scale + opacity)
    - Auto-focused search input
    - Sections: Recent Conversations, Quick Actions (New Chat, Toggle Theme, Settings), Models
    - Real-time filtering as user types
    - Keyboard navigation (↑↓, Enter, Esc)
    - Execute action on selection and close
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 12.4_

  - [x] 10.3 Create SettingsPanel drawer
    - Create `components/overlays/SettingsPanel.tsx`
    - Slide-in drawer from right with backdrop
    - Section navigation: Appearance, Models, Chat, Shortcuts, Data, About
    - Appearance: theme selection, font size slider
    - Models: default model selection
    - Shortcuts: display keyboard shortcuts table
    - Data: export conversations (JSON download), clear all conversations
    - Close on Esc or outside click with slide-out animation
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 11. Wire up keyboard shortcuts and global listeners
  - [x] 11.1 Implement global keyboard handler
    - Create `hooks/useKeyboardShortcuts.ts` custom hook
    - ⌘K / Ctrl+K: toggle command palette
    - Esc: close topmost overlay (command palette > settings > model selector)
    - Attach to window keydown event, clean up on unmount
    - _Requirements: 13.1, 13.4, 13.5_

  - [x] 11.2 Wire all components together in AppShell
    - Ensure ChatHeader triggers ModelSelector
    - Ensure LeftSidebar triggers CommandPalette via ⌘K button
    - Ensure Settings action (from command palette or sidebar) opens SettingsPanel
    - Verify all state flows work end-to-end
    - _Requirements: 9.1, 10.1, 11.1_

- [x] 12. Checkpoint - Full feature integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 13. Write property test: Theme Token Completeness
  - **Property 5: Theme Token Completeness**
  - Verify both dark and light theme objects have all required ThemeTokens keys with non-empty valid CSS color strings
  - **Validates: Requirements 1.1**

- [ ] 14. Final checkpoint - All tests pass and UI is polished
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Framer Motion must be installed before any animation work (Task 1.1)
- All data is mocked locally — no backend or API integration needed
- The design uses TypeScript throughout with strict type checking
- CSS custom properties handle theming to avoid re-render cascades
- Property tests use fast-check with Vitest (minimum 100 iterations)
