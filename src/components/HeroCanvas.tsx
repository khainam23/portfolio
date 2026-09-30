import { useEffect, useRef } from 'react'

const CYAN = [0, 212, 255]
const VIOLET = [139, 92, 246]
const LINK_DIST = 0.18

/** Floating nodes + connection lines (ported from /test/service). */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const host = canvas.parentElement!
    const ctx = canvas.getContext('2d')!
    const N = window.innerWidth < 768 ? 40 : 80
    let W = 0, H = 0, raf = 0
    const resize = () => { W = canvas.width = host.offsetWidth; H = canvas.height = host.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    const col = (t: number) =>
      `rgba(${CYAN.map((c, i) => Math.round(c + (VIOLET[i] - c) * t)).join(',')},`
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * 1.2 - 0.1, y: Math.random() * 1.2 - 0.1,
      vx: (Math.random() - 0.5) * 0.00015, vy: (Math.random() - 0.5) * 0.00015,
      r: Math.random() * 1.5 + 0.5, t: Math.random(),
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < -0.05 || n.x > 1.05) n.vx *= -1
        if (n.y < -0.05 || n.y > 1.05) n.vy *= -1
      }
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = nodes[i], b = nodes[j]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d >= LINK_DIST) continue
        const alpha = (1 - d / LINK_DIST) * 0.22
        const g = ctx.createLinearGradient(a.x * W, a.y * H, b.x * W, b.y * H)
        g.addColorStop(0, col(a.t) + alpha + ')')
        g.addColorStop(1, col(b.t) + alpha + ')')
        ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W, b.y * H)
        ctx.strokeStyle = g; ctx.lineWidth = 0.8; ctx.stroke()
      }
      for (const n of nodes) {
        const alpha = 0.6 + Math.sin(Date.now() * 0.001 + n.t * 10) * 0.3
        ctx.beginPath(); ctx.arc(n.x * W, n.y * H, n.r * (W / 1200), 0, Math.PI * 2)
        ctx.fillStyle = col(n.t) + alpha + ')'; ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 opacity-55" aria-hidden="true" />
}
