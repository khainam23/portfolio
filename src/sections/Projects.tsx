import SectionHeader from '../components/ui/SectionHeader'
import type { Project } from '../types'

export default function Projects({ items }: { items: Project[] }) {
  return (
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-[1160px] px-7">
        <SectionHeader title={<>Personal <em>projects</em></>} desc="Side projects I build, deploy and operate end-to-end." />
        <div className="grid gap-5 md:grid-cols-2">
          {items.map(p => (
            <article key={p.name} className="glass card-hover reveal-up flex flex-col rounded-2xl p-8">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan transition-all hover:gap-2.5">
                    Live
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
                  </a>
                )}
              </div>
              <p className="mb-4 text-[14.5px] text-ink/85">{p.description}</p>
              <ul className="dot-list mb-6 flex-1">
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
