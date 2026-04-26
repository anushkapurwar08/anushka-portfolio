'use client'
import { motion } from 'framer-motion'
import { research } from '@/lib/content'

const accents = ['bg-lilac/35', 'bg-blush', 'bg-sage/40']

export default function ResearchRoom() {
  return (
    <div>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-ink/65">
        Three open threads — finance, lung biology, and a stigmatised domain almost no one studies.
      </p>

      <div className="grid gap-5 md:grid-cols-3">
        {research.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className={`${accents[i % accents.length]} relative overflow-hidden rounded-3xl border border-ink/10 p-6 shadow-soft transition hover:-translate-y-1`}
          >
            <div className="eyebrow mb-3">{r.period}</div>
            <h3 className="font-display text-xl leading-tight text-ink">{r.title}</h3>
            <div className="mt-1 text-xs font-medium text-ink/60">{r.advisor}</div>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">{r.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
