import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
    const root = document.documentElement
    if (!('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).dataset.visible = ''
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px' }
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    root.classList.add('reveal-ready')

    return () => io.disconnect()
  }, [])
}
