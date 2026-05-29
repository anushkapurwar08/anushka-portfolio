'use client'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div className="h-1 origin-left bg-lilac" style={{ scaleX }} />
    </div>
  )
}
