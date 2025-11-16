'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect if the current device has touch capabilities
 * @returns boolean - true if device supports touch events
 */
export function useIsTouchDevice(): boolean {
  // Start with undefined to avoid hydration mismatch
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    // Check for touch support only on client side
    const hasTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - legacy check for older browsers
        (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0))

    setIsTouchDevice(hasTouch)
  }, [])

  // Return false during SSR and initial render to match server
  return isTouchDevice ?? false
}
