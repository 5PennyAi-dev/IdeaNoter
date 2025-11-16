'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect if the current device has touch capabilities
 * @returns boolean - true if device supports touch events
 */
export function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Check for touch support
    const checkTouch = () => {
      // Multiple checks for better compatibility
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - legacy check for older browsers
        (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)

      setIsTouchDevice(hasTouch)
    }

    checkTouch()
  }, [])

  return isTouchDevice
}
