import type { Profile } from '../types'

export default function Contact({ p }: { p: Profile }) {
  const items = [
    { label: 'Email', value: p.contact.email, href: `mailto:${p.contact.email}` },
    { label: 'Phone', value: p.contact.phone, href: `tel:+84${p.contact.phone.replace(/\D/g, '').slice(1)}` },
    { label: 'GitHub', value: 'github.com/khainam23', href: p.contact.github },
    { label: 'Location', value: p.location },
  ]
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-[1160px] px-7">
        <div className="glass reveal-up rounded-3xl bg-[radial-gradient(120%_140%_at_0%_0%,rgba(0,212,255,0.10)_0%,transparent_55%),radial-gradient(120%_140%_at_100%_100%,rgba(139,92,246,0.10)_0%,transparent_55%)] px-7 py-14 md:px-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/5 px-4 py-1.5 font-mono text-xs text-cyan">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#4ade80]" /> {p.status}
              </span>
              <h2 className="section-title mb-4">Let's build something<br /><em>reliable together</em></h2>
              <p className="mb-8 max-w-[480px] leading-7 text-muted">
                Looking for a DevOps / SRE engineer who cares about uptime, automation and clean infrastructure? I'd love to hear from you.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={`mailto:${p.contact.email}`} className="btn btn-primary">Send an email</a>
                <a href={p.cv} download className="btn btn-ghost">Download CV</a>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {items.map(it => (
                <li key={it.label} className="card-hover rounded-xl border border-line bg-[rgba(0,10,26,0.6)] px-5 py-4">
                  <span className="block text-[10.5px] font-semibold tracking-[0.09em] text-faint uppercase">{it.label}</span>
                  {it.href ? (
                    <a href={it.href} target={it.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="font-semibold transition-colors hover:text-cyan">{it.value}</a>
                  ) : (
                    <span className="font-semibold">{it.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
