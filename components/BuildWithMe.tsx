'use client'
import { motion, useDragControls } from 'framer-motion'
import { useState } from 'react'
import { profile } from '@/lib/content'

export default function BuildWithMe() {
  const controls = useDragControls()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    const subject = encodeURIComponent('Build with me')
    const body = encodeURIComponent(`Hi Anushka,\n\nMy email: ${email}\n\n— sent from anushkaland`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <motion.div
      drag
      dragControls={controls}
      dragMomentum={false}
      initial={{ x: 0, y: 0 }}
      className="fixed bottom-5 right-5 z-40 w-64 cursor-grab rotate-2 active:cursor-grabbing"
    >
      <div className="rounded-xl bg-lilac/80 p-4 shadow-soft ring-1 ring-ink/10 backdrop-blur">
        <div
          onPointerDown={(e) => controls.start(e)}
          className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-ink/70"
        >
          <span>Sticky note · drag me</span>
          <span>📌</span>
        </div>
        {sent ? (
          <p className="text-sm font-medium text-ink">Sent ✦ check your email client.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block font-display text-base leading-tight text-ink">
              Build with me?
            </label>
            <p className="mt-1 text-[11px] text-ink/60">Drop your email — I’ll write back.</p>
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
  )
}
