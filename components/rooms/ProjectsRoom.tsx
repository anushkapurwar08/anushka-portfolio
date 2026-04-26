'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { projects } from '@/lib/content'

export default function ProjectsRoom() {
  const [open, setOpen] = useState<number | null>(null)
  const active = open !== null ? projects[open] : null

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-ink/65">
        Three things I’ve built and shipped (not slide-decked). Click a card to peek inside.
      </p>

      <div className="grid gap-5 md:grid-cols-3">
        {projects.map((p, i) => (
          <motion.button
            key={p.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            onClick={() => setOpen(i)}
            className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(45,45,45,0.25)]"
          >
            <div className="eyebrow mb-3">{p.tag}</div>
            <h3 className="font-display text-2xl leading-tight text-ink">{p.name}</h3>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.stack.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-semibold text-ink/60 ring-1 ring-ink/5"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/5 pt-4">
              <span className="text-xs font-medium text-ink/50">click to peek inside</span>
              <div className="flex items-center gap-3">
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-semibold text-lilacDeep hover:underline"
                >
                  {p.linkLabel} ↗
                </a>
                {p.mockup && (
                  <a
                    href={p.mockup}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-semibold text-lilacDeep hover:underline"
                  >
                    {p.mockupLabel} ↗
                  </a>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[70] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-3xl bg-cream p-7 shadow-[0_30px_60px_-15px_rgba(45,45,45,0.4)]"
            >
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-blush text-ink transition hover:bg-lilac/60"
              >
                ×
              </button>
              <div className="eyebrow mb-2">{active.tag}</div>
              <h3 className="font-display text-3xl leading-tight text-ink">{active.name}</h3>
              <ul className="mt-5 space-y-2 text-sm leading-relaxed text-ink/75">
                {active.body.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-lilacDeep" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl bg-blush/60 p-3 text-sm italic text-ink/80">
                {active.why}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {active.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-ink/60 ring-1 ring-ink/5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream transition hover:bg-ink/85"
                  >
                    {active.linkLabel} ↗
                  </a>
                  {active.mockup && (
                    <a
                      href={active.mockup}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:bg-blush"
                    >
                      {active.mockupLabel} ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
