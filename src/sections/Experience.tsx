import SectionHeader from '../components/ui/SectionHeader'
import type { Experience as Exp } from '../types'

export default function Experience({ items }: { items: Exp[] }) {
  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-[1160px] px-7">
        <SectionHeader title={<>Work <em>experience</em></>} desc="From full-stack delivery to running production infrastructure at scale." />
        <ol className="relative ml-2 border-l border-line md:ml-0">
          {items.map((e, i) => (
            <li key={e.company + e.period} className="reveal-up relative pb-10 pl-8 last:pb-0 md:pl-12">
              <span className="absolute -left-[7px] top-8 h-3.5 w-3.5 rounded-full border-2 border-cyan bg-[var(--bg)] shadow-[0_0_12px_rgba(0,212,255,0.6)]" />
              <article className="glass card-hover rounded-2xl p-7 md:p-8">
                <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="grad-num font-mono text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">{e.title}</h3>
                    <p className="text-[15px] text-cyan">{e.company}</p>
                  </div>
                  <span className="flex items-center gap-2 rounded-full border border-line bg-cyan/5 px-3 py-1 font-mono text-xs text-muted">
                    {e.current && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#4ade80]" />}
                    {e.period}
                  </span>
                </header>
                <p className="mb-4 text-[14.5px] text-ink/85">{e.summary}</p>
                <ul className="dot-list mb-5">
                  {e.highlights.map(h => <li key={h}>{h}</li>)}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {e.tags.map(t => <span key={t} className="chip">{t}</span>)}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
