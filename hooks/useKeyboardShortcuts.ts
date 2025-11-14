import { useEffect } from 'react'

export interface KeyboardShortcutConfig {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  callback: () => void
  description?: string
}

/**
 * Custom hook to handle global keyboard shortcuts
 *
 * @param shortcuts - Array of keyboard shortcut configurations
 * @param enabled - Whether the shortcuts are enabled (default: true)
 *
 * @example
 * useKeyboardShortcuts([
 *   { key: 'n', ctrl: true, callback: () => createNewNote() },
 *   { key: 'f', ctrl: true, callback: () => focusSearch() },
 *   { key: 'Escape', callback: () => closeModal() }
 * ])
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcutConfig[],
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields (except Escape)
      const target = event.target as HTMLElement
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatches = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatches = shortcut.alt ? event.altKey : !event.altKey

        // Allow Escape to work in input fields
        const shouldTrigger = shortcut.key === 'Escape' || !isInputField

        if (keyMatches && ctrlMatches && shiftMatches && altMatches && shouldTrigger) {
          event.preventDefault()
          shortcut.callback()
          break // Only execute the first matching shortcut
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts, enabled])
}
