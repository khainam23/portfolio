import { useEffect } from 'react'

/** Adds `.revealed` to every `.reveal-up` element when it scrolls into view. */
export function useReveal(dep: unknown) {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal-up:not(.revealed)').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [dep])
}
