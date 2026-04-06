import type { Variants } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    // Pure, native IntersectionObserver - completely immune to framer-motion / Next.js cache bugs!
    const el = ref.current
    if (!el) return

    // Check immediately on mount in case it's already visible (like on bfcache restore)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && Math.abs(rect.bottom) > 0) {
      setHasRevealed(true)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true)
        }
      },
      { threshold },
    )

    observer.observe(el)

    // Keep it explicitly observed or check pageshow events to bulletproof back-button
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted && el) {
        const rc = el.getBoundingClientRect()
        if (rc.top < window.innerHeight && Math.abs(rc.bottom) > 0) setHasRevealed(true)
      }
    }
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      observer.disconnect()
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [threshold])

  return { ref, isInView: hasRevealed }
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
}
