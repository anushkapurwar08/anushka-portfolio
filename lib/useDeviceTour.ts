'use client'
import { useEffect, useState } from 'react'

// Decide whether to serve the full 3D tour or the lightweight 2D fallback.
// Phones get the real 3D dreamhouse too - the camera/UI adapt to portrait.
// We only fall back to 2D when WebGL is unavailable or motion is reduced.
export function useDeviceTour() {
  const [use3D, setUse3D] = useState<boolean | null>(null)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noWebGL = (() => {
      try {
        const c = document.createElement('canvas')
        return !(c.getContext('webgl') || c.getContext('experimental-webgl'))
      } catch { return true }
    })()
    setUse3D(!(reduced || noWebGL))
  }, [])
  return use3D
}
