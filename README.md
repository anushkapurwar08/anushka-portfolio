# anushka-portfolio

> Welcome to AnushkaLand — a small interactive house, with rooms instead of sections.

**Live:** [anushka-portfolio-i7xi.vercel.app](https://anushka-portfolio-i7xi.vercel.app/)

The personal portfolio site of **Anushka Purwar** — Product, GTM & Founder’s Office · BITS Pilani ’27.

The homepage is intentionally short — a hero with a hand-drawn dollhouse, then three quotes that keep me moving. Everything else lives behind the front door, as a guided tour through five rooms.

## Rooms

1. **The Workshop** — projects (shipped, not slide-decked)
2. **The Hallway** — internships, framed
3. **The Lab** — open research threads
4. **The Trophy Shelf** — a few medals, modestly displayed
5. **The Front Door** — knock, please

Use `← / →` to walk between rooms, `Esc` to head back to the homepage.

## Stack

- [Next.js 14](https://nextjs.org) (App Router) · TypeScript
- [Tailwind CSS](https://tailwindcss.com) with a custom blush / cream / lilac palette
- [Framer Motion](https://www.framer.com/motion/) for the doors, the cards, the rooms
- Fonts via `next/font/google`: Inter, Fraunces, Tiro Devanagari Hindi

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
# or:  npm run dev -- -p 3001
```

```bash
npm run build && npm start
```

## Project structure

```
app/
  layout.tsx        # fonts, metadata
  page.tsx          # homepage ↔ tour switcher
  globals.css       # base styles + room/card helpers
components/
  Hero.tsx          # name + dollhouse + CTAs
  Quotes.tsx        # three italicised cards
  Tour.tsx          # full-screen tour shell with prev/next/dots
  Nav.tsx           # (intentionally empty — no chrome)
  ProgressBar.tsx
  EasterEgg.tsx     # the 💌 in the corner
  BuildWithMe.tsx   # the draggable sticky note
  rooms/
    ProjectsRoom.tsx
    ExperienceRoom.tsx
    ResearchRoom.tsx
    TrophyRoom.tsx
    HireRoom.tsx
lib/
  content.ts        # single source of truth — every line traces to the résumé
public/
  resume.pdf
```

## Editing content

All copy lives in [`lib/content.ts`](lib/content.ts) — projects, experiences, research, achievements. Cards are rendered from this file, so updating the résumé is one edit, not many.

The internships room is a separate, intentionally curated list inside [`components/rooms/ExperienceRoom.tsx`](components/rooms/ExperienceRoom.tsx) — fewer roles, sharper headlines.

## Deploy

Easiest path: import this repo into [Vercel](https://vercel.com) and press deploy. No env vars, no build config to set.

## TODO

- Drop real photo at `public/anushka.jpg` and wire it into the Hire / Hero rooms
- Replace `#` placeholders in `lib/content.ts → projects[].link` with real GitHub / demo URLs
