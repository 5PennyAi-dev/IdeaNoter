'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect if the current viewport is mobile-sized (< 768px)
 * @returns boolean - true if viewport width is less than 768px
 */
export function useIsMobile(): boolean {
  // Start with undefined to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Initial check
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches)
    }

    // Check on mount
    checkMobile()

    // Add listener for viewport changes
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  // Return false during SSR and initial render to match server
  return isMobile ?? false
}
