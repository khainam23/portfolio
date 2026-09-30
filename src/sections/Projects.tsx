import SectionHeader from '../components/ui/SectionHeader'
import { cn } from '../lib/utils'
import type { Project } from '../types'

export default function Projects({ items }: { items: Project[] }) {
  return (
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-[1160px] px-7">
        <SectionHeader title={<>Selected <em>projects</em></>} desc="Production systems I operate and side projects I build, deploy and run end-to-end." />
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((p, i) => (
            <article
              key={p.name}
              className={cn(
                'glass card-hover reveal-up flex flex-col rounded-2xl p-8',
                p.featured && 'md:col-span-2 md:p-10 bg-[radial-gradient(90%_120%_at_0%_0%,rgba(0,212,255,0.08)_0%,transparent_60%)]',
              )}
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="grad-num font-mono text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={cn('font-display font-semibold tracking-tight', p.featured ? 'text-2xl' : 'text-xl')}>{p.name}</h3>
                  {p.role && <p className="mt-0.5 text-sm text-cyan">{p.role}</p>}
                </div>
                <div className="flex items-center gap-3">
                  {p.status && (
                    <span className="flex items-center gap-2 rounded-full border border-line bg-cyan/5 px-3 py-1 font-mono text-[11px] text-muted">
                      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                      {p.status}
                    </span>
                  )}
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan transition-all hover:gap-2.5">
                      Visit
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
                    </a>
                  )}
                </div>
              </div>
              <p className="mb-4 text-[14.5px] leading-7 text-ink/85">{p.description}</p>
              <ul className={cn('dot-list mb-6 flex-1', p.featured && 'md:grid md:grid-cols-2 md:gap-x-8')}>
                {p.highlights.map(h => <li key={h}>{h}</li>)}
              </ul>
              <div className="flex flex-wrap gap-2">
                {p.tags.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
