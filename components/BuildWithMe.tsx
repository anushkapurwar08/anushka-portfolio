'use client'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { useEffect, useState } from 'react'
import { profile } from '@/lib/content'

export default function BuildWithMe() {
  const controls = useDragControls()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [open, setOpen] = useState(false)

  // Expanded by default on desktop; collapsed on phones so it never
  // covers the page. Drag is disabled on touch so the pill stays put.
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const apply = () => {
      setIsDesktop(mq.matches)
      setOpen(mq.matches)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    const subject = encodeURIComponent('Build with me')
    const body = encodeURIComponent(`Hi Anushka,\n\nMy email: ${email}\n\n- sent from anushkaland`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-5 sm:right-5">
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="pill"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="rotate-2 rounded-full bg-lilac/90 px-4 py-2.5 text-sm font-bold text-ink shadow-soft ring-1 ring-ink/10 backdrop-blur"
          >
            ✦ Build with me?
          </motion.button>
        ) : (
          <motion.div
            key="note"
            drag={isDesktop}
            dragControls={controls}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-[min(16rem,calc(100vw-2rem))] rotate-2 cursor-grab active:cursor-grabbing"
          >
            <div className="rounded-xl bg-lilac/80 p-4 shadow-soft ring-1 ring-ink/10 backdrop-blur">
              <div
                onPointerDown={(e) => isDesktop && controls.start(e)}
                className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-ink/70"
              >
                <span>{isDesktop ? 'Sticky note · drag me' : 'Sticky note'}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-5 w-5 place-items-center rounded-full text-ink/60 transition hover:bg-white/50 hover:text-ink"
                >
                  ✕
                </button>
              </div>
              {sent ? (
                <p className="text-sm font-medium text-ink">Sent ✦ check your email client.</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <label className="block font-display text-base leading-tight text-ink">
                    Build with me?
                  </label>
                  <p className="mt-1 text-[11px] text-ink/60">Drop your email - I’ll write back.</p>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="mt-2 w-full rounded-md border border-ink/15 bg-white/90 px-2.5 py-1.5 text-xs text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-md bg-ink px-3 py-1.5 text-[11px] font-bold text-cream hover:bg-ink/85"
                  >
                    Send →
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
