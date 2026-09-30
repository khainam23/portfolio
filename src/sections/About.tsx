import SectionHeader from '../components/ui/SectionHeader'
import type { Profile } from '../types'

export default function About({ p }: { p: Profile }) {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-[1160px] px-7">
        <SectionHeader title={<>About <em>me</em></>} />
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="glass reveal-up rounded-2xl p-8">
            <p className="font-mono text-xs text-faint">$ cat about.md</p>
            <p className="mt-4 text-[15.5px] leading-8 text-ink/90">{p.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Reliability first', 'Automate the toil', 'Observe everything', 'Document & share'].map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="glass reveal-up rounded-2xl p-7">
              <p className="mb-2 font-mono text-[11px] tracking-[0.09em] text-faint uppercase">Education</p>
              <h3 className="font-display text-[17px] font-semibold">{p.education.degree}</h3>
              <p className="mt-1 text-sm text-muted">{p.education.school}</p>
              <p className="mt-3 font-mono text-sm">GPA <span className="grad-num font-bold">{p.education.gpa}</span></p>
            </div>
            <div className="glass reveal-up rounded-2xl p-7">
              <p className="mb-3 font-mono text-[11px] tracking-[0.09em] text-faint uppercase">Publications</p>
              <ul className="flex flex-col gap-4">
                {p.publications.map(pub => (
                  <li key={pub.title}>
                    <p className="text-sm font-medium leading-6">{pub.title}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {pub.venue} · <span className="text-cyan">{pub.rank}</span> · {pub.year}
                      {pub.doi && <> · <a className="hover:text-cyan" href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">DOI</a></>}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
