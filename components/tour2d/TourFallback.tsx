'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ROOMS, ROOM_ORDER, type RoomId, type ViewId } from '@/lib/tour'
import { profile } from '@/lib/content'
import { PANELS, AboutPanel, FarewellPanel } from '@/components/tour/panels'

const NAME: Record<ViewId, string> = {
  exterior: 'Welcome!', hall: 'The Entrance Hall',
  kitchen: 'The Kitchen', studio: 'The Studio', sunroom: 'The Sunroom', farewell: 'See you soon',
}

// Lightweight 2D dollhouse map (same rooms, fast on phones)
function HouseMap({ view, onPick, onAbout }: { view: ViewId; onPick: (id: RoomId | 'hall') => void; onAbout: () => void }) {
  const cell = (id: RoomId, label: string, emoji: string) => (
    <button onClick={() => onPick(id)} className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-[#F1ECE4] p-4 transition ${view === id ? 'border-lilacDeep scale-[1.02]' : 'border-ink/10 hover:border-lilac'}`}>
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs font-semibold text-ink/80">{label}</span>
    </button>
  )
  return (
    <div className="mx-auto w-full max-w-sm">
      {/* roof */}
      <div className="mx-auto h-0 w-0 border-x-[120px] border-b-[44px] border-x-transparent border-b-[#DCD4C7]" />
      <div className="overflow-hidden rounded-2xl border-2 border-ink/10 bg-[#FBF8F2] p-2 shadow-soft">
        {/* upstairs: studio */}
        {cell('studio', 'Studio', '🖋️')}
        {/* downstairs: kitchen | sunroom */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          {cell('kitchen', 'Kitchen', '🍳')}
          {cell('sunroom', 'Sunroom', '🌿')}
        </div>
        {/* hall + about strip */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button onClick={() => onPick('hall')} className={`rounded-2xl border-2 bg-[#F1ECE4] p-3 text-xs font-semibold text-ink/80 transition ${view === 'hall' ? 'border-lilacDeep' : 'border-ink/10 hover:border-lilac'}`}>🏠 Hall</button>
          <button onClick={onAbout} className="rounded-2xl border-2 border-lilacDeep/20 bg-lilac/20 p-3 text-xs font-semibold text-lilacDeep transition hover:border-lilac">📖 About the owner</button>
        </div>
      </div>
    </div>
  )
}

export default function TourFallback({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<ViewId>('hall')
  const [aboutOpen, setAboutOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = 'auto'; window.scrollTo(0, 0) }, [])

  const isRoom = (['kitchen', 'studio', 'sunroom'] as ViewId[]).includes(view)
  const Panel = isRoom ? PANELS[view as RoomId] : null

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-gradient-to-b from-[#FFF8F0] to-[#F3E8FB]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/5 bg-white/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-lilac/40 text-sm">🏠</span>
          <span className="font-display text-base text-ink">{NAME[view]}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={profile.resume} target="_blank" className="rounded-full bg-blush px-3 py-1.5 text-xs font-semibold text-ink">↓ Résumé</a>
          <button onClick={onExit} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 ring-1 ring-ink/10">✕</button>
        </div>
      </header>

      <div className="mx-auto max-w-md space-y-5 px-4 py-6">
        <p className="text-center text-sm text-ink/60">Tap a room to tour the Dreamhouse 🏡</p>
        <HouseMap view={view} onPick={(id) => { setView(id as ViewId) }} onAbout={() => setAboutOpen(true)} />

        <AnimatePresence mode="wait">
          {isRoom && Panel && (
            <motion.div key={view} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              className="rounded-3xl border border-ink/10 bg-white/85 p-5 shadow-soft">
              <Panel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* quick nav */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {ROOM_ORDER.map((id) => (
            <button key={id} onClick={() => setView(id as ViewId)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${view === id ? 'bg-lilacDeep text-cream' : 'bg-white text-ink/70 ring-1 ring-ink/10'}`}>
              {ROOMS.find((r) => r.id === id)?.name.replace('The ', '')}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-ink/10 bg-white/85 p-6 shadow-soft">
          <FarewellPanel />
        </div>
      </div>

      <AnimatePresence>
        {aboutOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm" onClick={() => setAboutOpen(false)}>
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-cream p-6 shadow-soft">
              <button onClick={() => setAboutOpen(false)} className="absolute right-4 top-4 text-sm text-ink/40">✕</button>
              <AboutPanel />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
