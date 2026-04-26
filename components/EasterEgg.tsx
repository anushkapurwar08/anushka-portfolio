'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function EasterEgg() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open easter egg"
        className="fixed bottom-5 left-5 z-40 grid h-10 w-10 -rotate-6 place-items-center rounded-md bg-blush text-base shadow-soft transition hover:rotate-0 hover:scale-110"
        title="psst"
      >
        💌
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 grid place-items-center bg-ink/30 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, rotate: -3, opacity: 0 }}
              animate={{ scale: 1, rotate: -2, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm rounded-2xl bg-blush p-6 shadow-soft"
            >
              <div className="absolute -top-3 left-6 h-6 w-20 rotate-2 rounded bg-lilac/70" />
              <div className="text-xs font-bold uppercase tracking-wide text-ink/60">Fun fact</div>
              <p className="mt-2 font-display text-xl leading-snug text-ink">
                I’ve reviewed 1,000+ startup decks at Conquest — and I still believe mine would win.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 text-xs font-semibold text-ink/60 hover:text-ink"
              >
                close ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
