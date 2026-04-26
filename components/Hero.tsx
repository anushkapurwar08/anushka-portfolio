'use client'
import { motion } from 'framer-motion'
import { profile } from '@/lib/content'

export default function Hero() {
  return (
    <section id="hero" className="room overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-blush blur-3xl opacity-70" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-lilac/50 blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sage/40 blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-grain opacity-[0.35] mix-blend-multiply" />
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="h-display"
          >
            Hi <span className="inline-block animate-pulse">👋</span>
            <br />
            <span className="text-lilacDeep">{profile.name}</span>
            <span className="ml-1 align-top text-3xl text-lilac">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70"
          >
            BITS Pilani ’27 · Product, GTM & Founder’s Office.
            <br />
            I build things, then talk about them in quotes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#quotes"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream shadow-soft transition hover:bg-ink/85"
            >
              What moves me ↓
            </a>
            <a
              href={profile.resume}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-5 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
            >
              Just give me the résumé
            </a>
          </motion.div>
        </div>

        <div className="md:col-span-5">
          <Dollhouse />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-ink/40">
        scroll ↓
      </div>
    </section>
  )
}

function Dollhouse() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-square w-full max-w-md float"
    >
      <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-[0_30px_50px_rgba(45,45,45,0.18)]">
        <polygon points="60,170 200,60 340,170" fill="#D8B4F8" />
        <polygon points="200,60 340,170 320,170 200,80" fill="#b893e8" />
        <rect x="70" y="170" width="260" height="180" fill="#FFF8F0" stroke="#2D2D2D" strokeWidth="2" rx="6" />
        <rect x="100" y="200" width="60" height="60" fill="#F8E8EE" stroke="#2D2D2D" strokeWidth="2" rx="4" />
        <line x1="130" y1="200" x2="130" y2="260" stroke="#2D2D2D" strokeWidth="1.5" />
        <line x1="100" y1="230" x2="160" y2="230" stroke="#2D2D2D" strokeWidth="1.5" />
        <rect x="240" y="200" width="60" height="60" fill="#F8E8EE" stroke="#2D2D2D" strokeWidth="2" rx="4" />
        <line x1="270" y1="200" x2="270" y2="260" stroke="#2D2D2D" strokeWidth="1.5" />
        <line x1="240" y1="230" x2="300" y2="230" stroke="#2D2D2D" strokeWidth="1.5" />
        <rect x="175" y="270" width="50" height="80" fill="#D8B4F8" stroke="#2D2D2D" strokeWidth="2" rx="6" />
        <circle cx="215" cy="312" r="2.5" fill="#2D2D2D" />
        <rect x="40" y="350" width="320" height="6" fill="#2D2D2D" rx="3" />
        <g transform="translate(184,128)">
          <path
            d="M0,0 a8,8 0 0,1 16,0 a8,8 0 0,1 16,0 q0,12 -16,22 q-16,-10 -16,-22 z"
            fill="#F8E8EE"
            stroke="#2D2D2D"
            strokeWidth="1.5"
          />
        </g>
      </svg>
      <div className="absolute -right-3 top-6 -rotate-6 rounded-xl bg-lilac/80 px-3 py-1.5 text-[11px] font-bold text-ink shadow-soft">
        Now hiring me
      </div>
      <div className="absolute -left-3 bottom-12 rotate-3 rounded-xl bg-blush px-3 py-1.5 text-[11px] font-bold text-ink shadow-soft">
        BITS Pilani · ’27
      </div>
    </motion.div>
  )
}
