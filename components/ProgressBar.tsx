'use client'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const pct = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`)

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div className="h-1 origin-left bg-lilac" style={{ scaleX }} />
      <div className="pointer-events-none absolute right-4 top-3 hidden md:block">
        <div className="rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-[11px] font-semibold text-ink/70 shadow-soft backdrop-blur">
          Tour progress: <motion.span>{pct}</motion.span>
        </div>
      </div>
    </div>
  )
}
