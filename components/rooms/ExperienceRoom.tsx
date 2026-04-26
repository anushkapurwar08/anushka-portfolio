'use client'
import { motion } from 'framer-motion'

const internships = [
  {
    role: 'Product & GTM Intern',
    company: 'Stealth — ex-Uber/Meesho leadership',
    period: 'Sept – Nov 2025',
    headline: 'Took a fuzzy idea and a quiet inbox to ~1,000 leads and a tested wedge.',
    bullets: [
      'Built an automated lead-sourcing & scraping system across Reddit and Instagram.',
      'Drove −1 → 0 discovery — interviews, low-fi prototypes, adoption tests.',
      'Ran growth experiments — assets, landing pages, funnels — to validate demand.',
    ],
    impact: ['~1,000 leads', 'Demand validated', 'PRDs shipped'],
    bg: 'bg-lilac/35',
    sticker: 'PM',
  },
  {
    role: 'Founder’s Office Intern',
    company: 'Shoffr',
    period: 'June – Aug 2025',
    headline: 'Outbound, a new business channel pilot, and a loyalty program — scoped end-to-end.',
    bullets: [
      'Owned outreach, follow-ups, coordination — directly contributing to acquisition.',
      'Researched and piloted a new business channel.',
      'Structured a customer loyalty initiative end-to-end.',
    ],
    impact: ['New channel piloted', 'Loyalty scoped'],
    bg: 'bg-blush',
    sticker: 'GTM',
  },
  {
    role: 'Founder’s Office Intern',
    company: 'Pinch',
    period: 'April – May 2025',
    headline: 'Slashed TAT in supply-chain & finance with PRDs and Apps Script automations.',
    bullets: [
      'Streamlined supply-chain & finance ops — TAT down, cross-team thrash down.',
      'Wrote PRDs end-to-end with product, design, and engineering.',
      'Shipped Google Apps Script automations to remove manual steps.',
    ],
    impact: ['Lower TAT', 'PRDs shipped', 'Automation live'],
    bg: 'bg-sage/45',
    sticker: 'OPS',
  },
  {
    role: 'Mentor & Govt. Relations Lead',
    company: 'Conquest · BITS Pilani',
    period: 'Feb 2024 – Aug 2025',
    headline: '1,000+ startups evaluated, 300+ VCs curated, ₹5L+ saved in partnerships.',
    bullets: [
      'Evaluated 1,000+ startups · 120+ founder interviews · 200+ pitch decks.',
      'Built the Startup India relationship for strategic initiatives & support.',
      'Negotiated partnerships saving ₹5L+ and curated 300+ VCs/founders.',
    ],
    impact: ['1,000+ startups', '₹5L+ saved', '300+ VCs'],
    bg: 'bg-cream',
    sticker: 'LEAD',
  },
]

export default function ExperienceRoom() {
  return (
    <div>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-ink/65">
        Four frames on the wall. Each card: the headline, what I actually did, what moved.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {internships.map((e, i) => (
          <motion.article
            key={e.company}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            className={`${e.bg} relative overflow-hidden rounded-3xl border border-ink/10 p-6 shadow-soft transition hover:-translate-y-1`}
          >
            <span className="absolute right-5 top-5 rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink/70">
              {e.sticker}
            </span>
            <div className="eyebrow mb-2">{e.period}</div>
            <h3 className="font-display text-2xl leading-tight text-ink">{e.role}</h3>
            <div className="mt-1 text-sm font-medium text-ink/70">{e.company}</div>

            <p className="mt-4 text-base leading-snug text-ink/85">{e.headline}</p>

            <ul className="mt-4 space-y-1.5 text-sm leading-snug text-ink/70">
              {e.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-ink/10 pt-3">
              {e.impact.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-ink/70 ring-1 ring-ink/5"
                >
                  {m}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
