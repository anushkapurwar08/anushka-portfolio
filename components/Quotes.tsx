'use client'
import { motion } from 'framer-motion'

const quotes = [
  {
    body: 'The ones who are crazy enough to think they can change the world, are the ones who do.',
    author: 'Steve Jobs',
    bg: 'bg-blush',
    rotate: '-rotate-1',
    font: 'font-display italic',
  },
  {
    body: 'There’s more to life than increasing its speed.',
    author: 'Mahatma Gandhi',
    bg: 'bg-cream',
    rotate: 'rotate-1',
    font: 'font-display italic',
  },
  {
    body: 'सीरियस HOKE क्या MILA',
    author: 'A reminder, mostly to myself',
    bg: 'bg-lilac/40',
    rotate: '-rotate-2',
    font: 'font-deva italic',
  },
]

export default function Quotes({ onTour }: { onTour: () => void }) {
  return (
    <section id="quotes" className="room">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="eyebrow mb-3">a small library</div>
          <h2 className="h-section">Quotes that keep me moving.</h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 180, damping: 22 }}
              className={`${q.bg} ${q.rotate} relative flex min-h-[260px] flex-col justify-between rounded-3xl border border-ink/10 p-7 shadow-soft transition hover:rotate-0 hover:-translate-y-1`}
            >
              <span className="absolute -top-4 left-6 font-display text-7xl leading-none text-ink/20">
                “
              </span>
              <blockquote className={`${q.font} text-xl leading-snug text-ink md:text-2xl`}>
                {q.body}
              </blockquote>
              <figcaption className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
                — {q.author}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="mb-5 text-sm text-ink/60">Now — want a tour of the house?</p>
          <button
            onClick={onTour}
            className="group inline-flex items-center gap-3 rounded-full bg-lilacDeep px-7 py-4 text-base font-semibold text-cream shadow-soft transition hover:bg-lilacDeep/90"
          >
            Open the front door
            <span className="transition group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
