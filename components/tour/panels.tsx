'use client'
import { profile, about, personalFav, experiences, projects, achievements, hobbies } from '@/lib/content'
import MovieReccos from '@/components/MovieReccos'

export function AboutPanel() {
  return (
    <div className="space-y-5">
      <div>
        <div className="eyebrow">about the owner</div>
        <h3 className="font-display text-3xl leading-tight text-ink md:text-4xl">{profile.name}</h3>
      </div>

      <p className="text-[15px] leading-relaxed text-ink/75">{about.intro}</p>

      <div className="flex flex-wrap gap-2">
        {about.roles.map((r) => (
          <span key={r} className="rounded-full bg-lilac/25 px-3 py-1 text-xs font-semibold text-lilacDeep ring-1 ring-lilacDeep/15">
            {r}
          </span>
        ))}
      </div>

      <p className="text-[15px] leading-relaxed text-ink/75">
        {about.autonomyPre}
        <em className="font-semibold italic text-lilacDeep">{about.autonomyWord}</em>
        {about.autonomyPost}
      </p>

      <p className="text-[15px] leading-relaxed text-ink/75">{about.movie}</p>
      <MovieReccos />
    </div>
  )
}

export function KitchenPanel() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
        What I’ve <em className="font-bold italic text-lilacDeep">cooked</em>
      </h2>
      {projects.map((p) => (
        <div key={p.name} className="rounded-2xl border border-ink/10 bg-white/85 p-4 shadow-soft">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="font-display text-xl text-ink">{p.name}</h4>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">{p.tag}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">{p.body[0]}</p>
          <p className="mt-1 text-xs italic text-ink/55">{p.why}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {p.stack.map((s) => (
              <span key={s} className="rounded-full bg-blush px-2.5 py-0.5 text-[11px] font-medium text-ink/70">{s}</span>
            ))}
            <a href={p.link} target="_blank" className="ml-auto text-xs font-semibold text-lilacDeep hover:underline">{p.linkLabel} ↗</a>
            {p.mockup && (
              <a href={p.mockup} target="_blank" className="text-xs font-semibold text-lilacDeep hover:underline">{p.mockupLabel} ↗</a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function StudioPanel() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">The Studio</h2>
      {experiences.map((e) => (
        <div key={e.role + e.company} className={`rounded-2xl border border-ink/10 ${e.color} p-4 shadow-soft`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="font-semibold text-ink">{e.role} <span className="font-normal text-ink/60">· {e.company}</span></h4>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">{e.period}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">{e.actions[0]}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {e.impact.map((i) => (
              <span key={i} className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-ink/70 ring-1 ring-ink/5">{i}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SunroomPanel() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">The Sunroom</h2>

      {/* Personal favourite — highlighted */}
      <div className="rounded-2xl border border-lilacDeep/20 bg-lilac/15 p-4 shadow-soft">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-base">⭐</span>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-lilacDeep">{personalFav.label}</span>
        </div>
        <p className="text-[15px] leading-relaxed text-ink/80">{personalFav.body}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {hobbies.map((h) => (
          <div key={h.label} className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-white/85 p-3 shadow-soft">
            <span className="text-2xl">{h.emoji}</span>
            <div>
              <div className="text-sm font-semibold text-ink">{h.label}</div>
              <div className="text-xs text-ink/60">{h.note}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="eyebrow mb-2">a few medals, modestly displayed</div>
        <ul className="space-y-1.5">
          {achievements.map((a) => (
            <li key={a} className="flex gap-2 text-sm text-ink/75"><span className="text-lilacDeep">★</span>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function FarewellPanel() {
  return (
    <div className="space-y-5 text-center">
      <div>
        <div className="eyebrow">end of the tour</div>
        <h3 className="font-display text-3xl leading-tight text-ink md:text-4xl">Thank you for the tour 💌</h3>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink/70">
          That’s the whole house. If anything caught your eye, here’s my résumé and the easiest ways to reach me.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <a href={profile.resume} target="_blank" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream shadow-soft transition hover:bg-ink/85">↓ Résumé (PDF)</a>
        <a href={`mailto:${profile.email}?subject=Let%27s%20talk`} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-blush">✉ Write to me</a>
        <a href={profile.linkedin} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-blush">in · LinkedIn</a>
      </div>
      <div className="text-xs text-ink/50">{profile.email} · {profile.phone}</div>
    </div>
  )
}

export const PANELS = {
  kitchen: KitchenPanel,
  studio: StudioPanel,
  sunroom: SunroomPanel,
} as const
