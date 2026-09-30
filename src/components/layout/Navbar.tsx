import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

const LINKS = [
  ['#about', 'About'],
  ['#experience', 'Experience'],
  ['#projects', 'Projects'],
  ['#skills', 'Skills'],
  ['#contact', 'Contact'],
]

export default function Navbar({ cv }: { cv: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const bar = document.getElementById('scroll-progress')
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const obs = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s))
    return () => { window.removeEventListener('scroll', onScroll); obs.disconnect() }
  }, [])

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-200',
        scrolled || open
          ? 'border-b border-line bg-[rgba(2,3,10,0.72)] py-3 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-2xl'
          : 'py-5',
      )}
    >
      <div className="mx-auto flex max-w-[1160px] items-center px-7">
        <a href="#home" className="mr-auto flex items-center gap-2.5" aria-label="Home">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14 2L26 8.5V19.5L14 26L2 19.5V8.5L14 2Z" stroke="#00d4ff" strokeWidth="1.5" />
            <path d="M14 7L21 11V17L14 21L7 17V11L14 7Z" fill="#00d4ff" opacity="0.2" />
            <circle cx="14" cy="14" r="2.5" fill="#00d4ff" />
          </svg>
          <span className="text-[17px] font-medium tracking-tight">
            khai<strong className="grad-num font-extrabold">nam</strong>
            <span className="font-mono text-sm text-faint">.dev</span>
          </span>
        </a>

        <ul
          className={cn(
            'gap-0.5 md:mr-3 md:flex',
            open
              ? 'absolute inset-x-0 top-full flex flex-col border-b border-line bg-[rgba(2,3,10,0.95)] px-7 pb-6 pt-4 backdrop-blur-2xl'
              : 'hidden',
          )}
        >
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors hover:bg-cyan/5 hover:text-ink',
                  active === href ? 'text-cyan' : 'text-muted',
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a href={cv} download className="btn btn-primary hidden !px-4.5 !py-2 !text-[13px] md:inline-flex">
          Download CV
        </a>
        <button
          className="flex flex-col gap-1 p-2 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          <span className="block h-px w-5 bg-ink" />
          <span className="block h-px w-5 bg-ink" />
          <span className="block h-px w-5 bg-ink" />
        </button>
      </div>
    </nav>
  )
}
