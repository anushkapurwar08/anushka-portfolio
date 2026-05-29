'use client'
import { useState } from 'react'

// ┌──────────────────────────────────────────────────────────────────┐
// │  SWAP THIS IN: paste your Formspree endpoint between the quotes.   │
// │  Looks like: https://formspree.io/f/abcdwxyz                       │
// │  Get it free at formspree.io → New form → copy the endpoint URL.   │
// │  Until you do, the mailbox falls back to opening the visitor's     │
// │  email app addressed to you (still works, just not stored).        │
// └──────────────────────────────────────────────────────────────────┘
const FORMSPREE_ENDPOINT = ''
const FALLBACK_EMAIL = 'f20231173@pilani.bits-pilani.ac.in'

export default function MovieReccos() {
  const [rec, setRec] = useState('')
  const [from, setFrom] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rec.trim()) return
    setErr('')

    // No endpoint configured yet → graceful mailto fallback.
    if (!FORMSPREE_ENDPOINT) {
      const subject = encodeURIComponent('Movie rec for Anushka 🎬')
      const body = encodeURIComponent(`Recommendation: ${rec}\n${from ? `From: ${from}` : ''}`)
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`
      setSent(true)
      return
    }

    try {
      setBusy(true)
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ recommendation: rec, from: from || 'anonymous', _subject: 'New movie rec 🎬' }),
      })
      if (!res.ok) throw new Error('bad response')
      setSent(true)
    } catch {
      setErr('Hmm, that didn’t go through. Try again?')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl bg-[#F3EFE8] p-4 ring-1 ring-ink/10">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="text-base">📬</span> Drop your movie reccos!
      </div>
      {sent ? (
        <p className="text-sm text-ink/70">Noted ✦ thank you — I’ll go watch it.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            value={rec}
            onChange={(e) => setRec(e.target.value)}
            required
            placeholder="A disaster/horror film I must see…"
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-lilacDeep focus:outline-none"
          />
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="your name (optional)"
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-xs text-ink placeholder:text-ink/40 focus:border-lilacDeep focus:outline-none"
          />
          {err && <p className="text-xs text-red-500">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-lilacDeep px-3 py-2 text-xs font-bold text-cream transition hover:bg-lilacDeep/90 disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Send it →'}
          </button>
        </form>
      )}
    </div>
  )
}
