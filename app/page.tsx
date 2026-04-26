'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Nav from '@/components/Nav'
import ProgressBar from '@/components/ProgressBar'
import Hero from '@/components/Hero'
import Quotes from '@/components/Quotes'
import Tour from '@/components/Tour'
import EasterEgg from '@/components/EasterEgg'
import BuildWithMe from '@/components/BuildWithMe'

export default function Home() {
  const [tourOpen, setTourOpen] = useState(false)
  return (
    <>
      {!tourOpen && (
        <>
          <ProgressBar />
          <Nav />
          <main className="relative">
            <Hero />
            <Quotes onTour={() => setTourOpen(true)} />
          </main>
          <EasterEgg />
          <BuildWithMe />
        </>
      )}
      <AnimatePresence>{tourOpen && <Tour onExit={() => setTourOpen(false)} />}</AnimatePresence>
    </>
  )
}
