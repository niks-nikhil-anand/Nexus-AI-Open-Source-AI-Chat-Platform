import type { ThemeTokens } from './types'

export const darkTheme: ThemeTokens = {
  void: '#0D0C0F',
  surface1: '#131217',
  surface2: '#1A1920',
  surface3: '#242230',
  border: '#2A2835',
  accent: '#7C6AFF',
  accentHover: '#9485FF',
  textPrimary: '#E8E6F0',
  textSecondary: '#8B88A0',
  textMuted: '#52506A',
  userBubble: '#1E1C2E',
  success: '#3ECF8E',
  warning: '#F0A429',
  error: '#F06A6A',
}

export const lightTheme: ThemeTokens = {
  void: '#F7F6FB',
  surface1: '#FFFFFF',
  surface2: '#F1F0F7',
  surface3: '#E8E7F2',
  border: '#DDDBE8',
  accent: '#6355E8',
  accentHover: '#5246D4',
  textPrimary: '#1A1830',
  textSecondary: '#6B6880',
  textMuted: '#A09DB8',
  userBubble: '#EEEDF7',
  success: '#3ECF8E',
  warning: '#F0A429',
  error: '#F06A6A',
}

const THEME_STORAGE_KEY = 'neurachat-theme'

/**
 * Applies the given theme by toggling the `.light` class on <html>.
 * Dark is the default (no class), light adds `.light`.
 */
export function applyTheme(theme: 'dark' | 'light'): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  if (theme === 'light') {
    root.classList.add('light')
    root.classList.remove('dark')
  } else {
    root.classList.add('dark')
    root.classList.remove('light')
  }
}

/**
 * Reads the saved theme from localStorage, falling back to 'dark'.
 */
export function getInitialTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.)
  }

  return 'dark'
}

/**
 * Persists the theme preference to localStorage.
 */
export function saveTheme(theme: 'dark' | 'light'): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // localStorage unavailable — silently fail
  }
}
