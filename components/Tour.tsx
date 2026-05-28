'use client'
import dynamic from 'next/dynamic'
import { useDeviceTour } from '@/lib/useDeviceTour'

const Dreamhouse = dynamic(() => import('./tour3d/Dreamhouse'), { ssr: false })
const TourFallback = dynamic(() => import('./tour2d/TourFallback'), { ssr: false })

export default function Tour({ onExit }: { onExit: () => void }) {
  const use3D = useDeviceTour()

  if (use3D === null) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#FFF8F0] to-[#F3E8FB]">
        <div className="text-4xl">🏡</div>
        <p className="animate-pulse text-sm font-medium text-ink/60">Unlocking the Dreamhouse…</p>
      </div>
    )
  }
  return use3D ? <Dreamhouse onExit={onExit} /> : <TourFallback onExit={onExit} />
}
