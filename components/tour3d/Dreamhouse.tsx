'use client'
import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import House, { CAMERA } from './House'
import { ROOMS, ROOM_ORDER, type RoomId, type ViewId } from '@/lib/tour'
import { profile } from '@/lib/content'
import { PANELS, AboutPanel, FarewellPanel } from '@/components/tour/panels'

const NAME: Record<ViewId, string> = {
  exterior: 'Welcome!',
  hall: 'The Entrance Hall',
  kitchen: 'The Kitchen',
  studio: 'The Studio',
  sunroom: 'The Sunroom',
  farewell: 'See you soon',
}

export default function Dreamhouse({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<ViewId>('exterior')
  const [entered, setEntered] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [visited, setVisited] = useState<Set<RoomId>>(new Set())

  // Tour progress lingers from the homepage: fills as rooms are seen, 100% at the farewell.
  useEffect(() => {
    if ((['kitchen', 'studio', 'sunroom'] as ViewId[]).includes(view)) {
      setVisited((prev) => (prev.has(view as RoomId) ? prev : new Set(prev).add(view as RoomId)))
    }
  }, [view])
  const tourPct = view === 'farewell' ? 100 : Math.round((visited.size / 3) * 100)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = ''; document.body.style.cursor = 'auto' }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { if (aboutOpen) setAboutOpen(false); else onExit() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit, aboutOpen])

  function enterHall() { setEntered(true); setView('hall') }
  function goRoom(id: RoomId) { setEntered(true); setView(id) }

  const isRoom = (['kitchen', 'studio', 'sunroom'] as ViewId[]).includes(view)
  const Panel = isRoom ? PANELS[view as RoomId] : null

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[60] bg-gradient-to-b from-[#FFF8F0] to-[#F3E8FB]"
    >
      {/* 3D layer */}
      <div className="absolute inset-0">
        <Canvas shadows camera={{ position: CAMERA.exterior.pos, fov: 45 }} dpr={[1, 1.8]} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <House view={view} entered={entered} onEnterHall={enterHall} onSelectRoom={goRoom} onOpenAbout={() => setAboutOpen(true)} />
          </Suspense>
        </Canvas>
      </div>

      {/* Tour progress bar — lingers from the homepage until the tour is complete */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-1 bg-lilac/25">
        <div className="h-full bg-lilacDeep transition-all duration-700 ease-out" style={{ width: `${tourPct}%` }} />
      </div>

      {/* Top chrome */}
      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 md:p-6">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 shadow-soft backdrop-blur">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-lilac/40 text-sm">🏠</span>
          <div className="font-display text-base leading-none text-ink">{NAME[view]}</div>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="hidden rounded-full border border-ink/10 bg-white/80 px-3 py-2 text-xs font-semibold text-ink/70 shadow-soft backdrop-blur sm:block">
            Tour progress: {tourPct}%
          </div>
          <a href={profile.resume} target="_blank" className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-ink shadow-soft backdrop-blur transition hover:bg-blush">↓ Résumé</a>
          <button onClick={onExit} className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-ink/70 shadow-soft backdrop-blur transition hover:bg-blush">✕ exit</button>
        </div>
      </header>

      {/* Exterior hint */}
      <AnimatePresence>
        {view === 'exterior' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 text-center"
          >
            <p className="text-sm font-medium text-ink/70">Welcome to the Dreamhouse. Click the front door to step inside.</p>
            <button onClick={enterHall} className="pointer-events-auto rounded-full bg-lilacDeep px-6 py-3 text-sm font-semibold text-cream shadow-soft transition hover:bg-lilacDeep/90">
              Open the front door →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hall hint */}
      <AnimatePresence>
        {view === 'hall' && !aboutOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center px-4"
          >
            <div className="pointer-events-auto max-w-sm rounded-2xl bg-white/80 px-5 py-4 text-center shadow-soft backdrop-blur">
              <p className="text-sm text-ink/75">You’re in the hall. Open the <span className="font-semibold text-lilacDeep">magazine on the desk</span> to meet the owner — or pick a room below.</p>
              <button onClick={() => setAboutOpen(true)} className="mt-3 rounded-full bg-blush px-4 py-2 text-xs font-semibold text-ink transition hover:bg-lilac/50">📖 About the owner</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room content panel */}
      <AnimatePresence mode="wait">
        {isRoom && Panel && (
          <motion.aside
            key={view}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col md:w-[42%]"
          >
            <div className="m-3 mt-20 flex-1 overflow-y-auto rounded-3xl border border-ink/10 bg-white/85 p-5 shadow-soft backdrop-blur md:m-4 md:mt-20 md:p-6">
              <Panel />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Farewell */}
      <AnimatePresence>
        {view === 'farewell' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg rounded-3xl border border-ink/10 bg-white/90 p-8 shadow-soft backdrop-blur">
              <FarewellPanel />
              <button onClick={() => setView('hall')} className="mx-auto mt-5 block text-xs font-semibold text-ink/50 hover:text-ink">← back into the house</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About magazine modal */}
      <AnimatePresence>
        {aboutOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
            onClick={() => setAboutOpen(false)}
          >
            <motion.div
              initial={{ rotateX: -25, y: 20, opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} exit={{ rotateX: -25, y: 20, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl border border-ink/10 bg-cream p-7 shadow-[0_30px_80px_-20px_rgba(45,45,45,0.4)]"
            >
              <button onClick={() => setAboutOpen(false)} className="absolute right-4 top-4 text-sm text-ink/40 hover:text-ink">✕</button>
              <AboutPanel />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom room nav */}
      {entered && view !== 'farewell' && (
        <nav className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 p-4">
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-full bg-white/80 p-1.5 shadow-soft backdrop-blur">
            <button onClick={() => setView('hall')} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${view === 'hall' ? 'bg-lilacDeep text-cream' : 'text-ink/70 hover:bg-blush'}`}>Hall</button>
            {ROOM_ORDER.map((id) => (
              <button key={id} onClick={() => goRoom(id as RoomId)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${view === id ? 'bg-lilacDeep text-cream' : 'text-ink/70 hover:bg-blush'}`}>
                {ROOMS.find((r) => r.id === id)?.emoji} {ROOMS.find((r) => r.id === id)?.name.replace('The ', '')}
              </button>
            ))}
            <button onClick={() => setView('farewell')} className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-cream transition hover:bg-ink/85">Finish ▸</button>
          </div>
        </nav>
      )}
    </motion.div>
  )
}
