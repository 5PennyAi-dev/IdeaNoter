import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'ideanoted-theme'

/**
 * Custom hook to manage dark/light theme
 *
 * Features:
 * - Persists theme preference in localStorage
 * - Applies theme class to document.documentElement
 * - Detects system preference on first load
 * - Provides toggle function
 *
 * @returns Object with current theme and toggle function
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage or system preference on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null

    if (stored) {
      setTheme(stored)
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }

    setMounted(true)
  }, [])

  // Apply theme class to document and save to localStorage
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    toggleTheme,
    mounted // Useful to prevent flash of wrong theme
  }
}
