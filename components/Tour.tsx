'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import ProjectsRoom from './rooms/ProjectsRoom'
import ExperienceRoom from './rooms/ExperienceRoom'
import ResearchRoom from './rooms/ResearchRoom'
import TrophyRoom from './rooms/TrophyRoom'
import HireRoom from './rooms/HireRoom'

const ROOMS = [
  { id: 'projects', title: 'The Workshop', subtitle: 'where things get built', Component: ProjectsRoom },
  { id: 'experience', title: 'The Hallway', subtitle: 'framed founder’s-office stories', Component: ExperienceRoom },
  { id: 'research', title: 'The Lab', subtitle: 'open research threads', Component: ResearchRoom },
  { id: 'trophy', title: 'The Trophy Shelf', subtitle: 'a few medals, modestly displayed', Component: TrophyRoom },
  { id: 'hire', title: 'The Front Door', subtitle: 'knock, please', Component: HireRoom },
]

export default function Tour({ onExit }: { onExit: () => void }) {
  const [idx, setIdx] = useState(0)
  const room = ROOMS[idx]
  const Component = room.Component

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onExit()
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(i + 1, ROOMS.length - 1))
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[60] flex flex-col bg-cream"
    >
      {/* top chrome */}
      <header className="flex items-center justify-between border-b border-ink/5 bg-white/70 px-6 py-4 backdrop-blur md:px-10">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-lilac/40 text-sm">🏠</span>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
              Room {idx + 1} of {ROOMS.length}
            </div>
            <div className="font-display text-lg leading-none text-ink">{room.title}</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {ROOMS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setIdx(i)}
              aria-label={`Go to ${r.title}`}
              className={`h-2 rounded-full transition ${
                i === idx ? 'w-8 bg-lilacDeep' : 'w-2 bg-ink/20 hover:bg-ink/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onExit}
          aria-label="Exit tour"
          className="rounded-full border border-ink/10 bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:bg-blush hover:text-ink"
        >
          ← back home
        </button>
      </header>

      {/* room body */}
      <div className="relative flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto h-full w-full max-w-6xl px-6 py-10 md:px-10"
          >
            <div className="mb-8">
              <div className="eyebrow">{room.subtitle}</div>
              <h2 className="h-section mt-1">{room.title}</h2>
            </div>
            <Component />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* bottom nav */}
      <nav className="flex items-center justify-between border-t border-ink/5 bg-white/70 px-6 py-4 backdrop-blur md:px-10">
        <button
          onClick={() => setIdx((i) => Math.max(i - 1, 0))}
          disabled={idx === 0}
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-blush disabled:opacity-30"
        >
          ← {ROOMS[Math.max(idx - 1, 0)].title}
        </button>
        <div className="hidden text-[11px] uppercase tracking-[0.2em] text-ink/40 md:block">
          press → / ← / esc
        </div>
        <button
          onClick={() => {
            if (idx === ROOMS.length - 1) onExit()
            else setIdx((i) => i + 1)
          }}
          className="inline-flex items-center gap-2 rounded-full bg-lilacDeep px-4 py-2 text-sm font-semibold text-cream shadow-soft transition hover:bg-lilacDeep/90"
        >
          {idx === ROOMS.length - 1 ? 'Close the tour' : `${ROOMS[idx + 1].title}`} →
        </button>
      </nav>
    </motion.div>
  )
}
