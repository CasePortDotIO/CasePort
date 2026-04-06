import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pure, native IntersectionObserver - completely immune to framer-motion / Next.js cache bugs!
    const el = ref.current
    if (!el) return

    // Check immediately on mount in case it's already visible (like on bfcache restore)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold },
    )

    observer.observe(el)

    // Keep it explicitly observed or check pageshow events to bulletproof back-button
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted && el) {
        const rc = el.getBoundingClientRect()
        if (rc.top < window.innerHeight && rc.bottom > 0) setIsVisible(true)
      }
    }
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      observer.disconnect()
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [threshold])

  return { ref, isVisible }
}
