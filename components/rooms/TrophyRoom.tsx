'use client'
import { motion } from 'framer-motion'

const wins = [
  { title: '4 of 370+', sub: 'Nexus — Strategy Enigma · IIM Lucknow × Rohtak', icon: '🏆' },
  { title: 'National Finalist', sub: 'B-Plan Competition · IIT Bhubaneswar', icon: '🥈' },
  { title: 'Winner', sub: 'Multiverse of Marketing · BITS Pilani', icon: '✨' },
  { title: 'Finalist', sub: 'D. E. Shaw Finspire Fellowship', icon: '✦' },
  { title: 'HPAIR ’24', sub: 'Harvard Project for Asian & International Relations', icon: '🎓' },
  { title: 'Best Delegate', sub: 'All India Political Party Meet · MUN', icon: '🎤' },
]

export default function TrophyRoom() {
  return (
    <div>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-ink/65">
        A small shelf. Dust-free. Mostly.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {wins.map((w, i) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 220, damping: 20 }}
            className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-soft transition hover:-translate-y-1"
          >
            <div className="text-4xl transition group-hover:scale-110">{w.icon}</div>
            <div className="mt-4 font-display text-xl leading-tight text-ink">{w.title}</div>
            <div className="mt-1 text-xs leading-snug text-ink/55">{w.sub}</div>
            <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-lilac/30 opacity-0 blur-xl transition group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
