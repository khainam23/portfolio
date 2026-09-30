import Scene3D from '../components/Scene3D'
import globe from '../three/globe'
import type { Profile } from '../types'

export default function Hero({ p }: { p: Profile }) {
  const [first, ...rest] = p.name.split(' ').reverse()
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="orb-1 absolute -top-52 left-1/2 -ml-[500px] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.22)_0%,rgba(0,212,255,0.06)_40%,transparent_70%)] blur-[80px]" />
        <div className="orb-2 absolute -top-24 left-1/2 ml-20 h-[580px] w-[580px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22)_0%,rgba(139,92,246,0.06)_40%,transparent_70%)] blur-[90px]" />
        <div className="grid-overlay absolute inset-0" />
      </div>
      {/* Globe: right column on desktop, faded backdrop on mobile */}
      <Scene3D build={globe} className="!absolute inset-0 opacity-35 lg:inset-y-0 lg:left-[48%] lg:right-[-6%] lg:opacity-100" />

      <div className="relative z-10 mx-auto w-full max-w-[1160px] px-7 py-16 text-center lg:text-left">
        <div className="lg:max-w-[600px]">
        <div className="fade-up mb-7 inline-flex items-center gap-2.5 rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5 font-mono text-xs text-muted backdrop-blur-xl">
          <span className="pulse-dot h-[7px] w-[7px] rounded-full bg-[#4ade80]" />
          <span>
            <span className="text-cyan">nam.status</span> = <span className="text-[#4ade80]">{p.status}</span>
          </span>
        </div>

        <h1 className="fade-up mb-5 font-display text-[clamp(40px,7.5vw,84px)] font-extrabold leading-[1.04] tracking-[-0.045em] lg:text-[clamp(40px,6vw,76px)] [animation-delay:80ms]">
          {rest.reverse().join(' ')} <em>{first}</em>
        </h1>
        <p className="fade-up mb-3 font-mono text-sm tracking-[0.12em] text-cyan uppercase [animation-delay:120ms]">
          {p.role} · {p.focus.join(' · ')}
        </p>
        <p className="fade-up mx-auto mb-10 max-w-[600px] lg:mx-0 text-[clamp(15px,2vw,17px)] leading-8 text-muted [animation-delay:160ms]">
          {p.tagline}
        </p>

        <div className="fade-up mb-14 flex flex-wrap justify-center gap-3 lg:justify-start [animation-delay:240ms]">
          <a href="#contact" className="btn btn-primary">
            Let's work together
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href={p.cv} download className="btn btn-ghost">Download CV (PDF)</a>
        </div>

        </div>
        <div className="fade-up mx-auto grid max-w-[860px] grid-cols-2 lg:mx-0 lg:max-w-[600px] gap-px overflow-hidden rounded-2xl bg-gradient-to-br from-cyan/15 to-violet/15 shadow-[0_0_0_1px_var(--border)] md:grid-cols-4 [animation-delay:320ms]">
          {p.stats.map(s => (
            <div key={s.label} className="bg-[var(--surface)] px-4 py-5 backdrop-blur-xl">
              <div className="grad-num font-mono text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-xs text-faint">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block" aria-hidden="true">
        <div className="scroll-indicator relative h-9 w-[22px] rounded-[11px] border border-cyan/15 bg-cyan/[0.03]" />
      </div>
    </section>
  )
}
