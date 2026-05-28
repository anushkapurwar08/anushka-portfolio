'use client'
import { useEffect, useState } from 'react'

// Decide whether to serve the full 3D tour or the lightweight 2D fallback.
// Conservative: phones, coarse pointers, low core counts, or reduced-motion -> 2D.
export function useDeviceTour() {
  const [use3D, setUse3D] = useState<boolean | null>(null)
  useEffect(() => {
    const smallScreen = window.matchMedia('(max-width: 820px)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowCores = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 8) <= 4
    const noWebGL = (() => {
      try {
        const c = document.createElement('canvas')
        return !(c.getContext('webgl') || c.getContext('experimental-webgl'))
      } catch { return true }
    })()
    const fallback = smallScreen || (coarse && smallScreen) || reduced || lowCores || noWebGL
    setUse3D(!fallback)
  }, [])
  return use3D
}
