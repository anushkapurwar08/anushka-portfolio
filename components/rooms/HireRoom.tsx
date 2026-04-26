'use client'
import { motion } from 'framer-motion'
import { profile } from '@/lib/content'

const tags = ['Product Strategy', 'PRDs', '−1→0 Discovery', 'Growth', 'GTM', 'SQL', 'Figma', 'Flutter']

export default function HireRoom() {
  return (
    <div className="grid gap-10 md:grid-cols-12 md:items-center">
      <div className="md:col-span-7">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-5xl leading-tight md:text-6xl"
        >
          Knock <span className="text-lilacDeep">knock.</span>
        </motion.h3>

        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">
          Open to PM, AI PM and Founder’s Office roles where ownership and shipping are the bar. Inbox is open.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}?subject=Let%27s%20talk`}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream shadow-soft transition hover:bg-ink/85"
          >
            ✉ Write to me
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-blush"
          >
            in · LinkedIn
          </a>
          <a
            href={profile.resume}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-blush"
          >
            ↓ Résumé (PDF)
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-blush/70 px-3 py-1 text-[11px] font-semibold text-ink/70 ring-1 ring-ink/5"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-10 text-xs text-ink/50">
          {profile.email} · {profile.phone}
        </div>
      </div>

      <div className="md:col-span-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative mx-auto aspect-square w-full max-w-sm"
        >
          <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-[0_30px_40px_rgba(45,45,45,0.18)]">
            {/* doormat */}
            <ellipse cx="150" cy="270" rx="110" ry="14" fill="#2D2D2D" opacity="0.1" />
            {/* door frame */}
            <rect x="60" y="40" width="180" height="225" rx="14" fill="#FFF8F0" stroke="#2D2D2D" strokeWidth="2.5" />
            {/* door panels */}
            <rect x="80" y="60" width="140" height="80" rx="6" fill="#D8B4F8" opacity="0.4" />
            <rect x="80" y="155" width="140" height="80" rx="6" fill="#D8B4F8" opacity="0.4" />
            {/* knob */}
            <circle cx="210" cy="165" r="6" fill="#8B5CC0" />
            {/* knocker */}
            <circle cx="150" cy="100" r="14" fill="none" stroke="#2D2D2D" strokeWidth="3" />
            {/* welcome sign */}
            <rect x="105" y="22" width="90" height="22" rx="5" fill="#F8E8EE" stroke="#2D2D2D" strokeWidth="1.5" />
            <text x="150" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#2D2D2D" fontStyle="italic">
              welcome
            </text>
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
