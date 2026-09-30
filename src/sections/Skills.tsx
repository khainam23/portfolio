import SectionHeader from '../components/ui/SectionHeader'
import type { SkillGroup } from '../types'

export default function Skills({ groups }: { groups: SkillGroup[] }) {
  const all = groups.flatMap(g => g.items)
  return (
    <section id="skills" className="overflow-hidden py-24">
      <div className="mx-auto max-w-[1160px] px-7">
        <SectionHeader title={<>Tech <em>stack</em></>} desc="Tools I use daily to build, ship and keep systems healthy." />
      </div>

      <div className="mask-x mb-14 overflow-hidden">
        <div className="marquee flex w-max gap-2.5">
          {[...all, ...all].map((t, i) => (
            <span key={i} className="chip !px-5 !py-2.5 !text-[12.5px]">{t}</span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1160px] px-7">
        <div className="reveal-up grid gap-px overflow-hidden rounded-2xl bg-gradient-to-br from-cyan/12 to-violet/12 shadow-[0_0_0_1px_var(--border),0_40px_100px_rgba(0,0,0,0.45)] sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(g => (
            <div key={g.group} className="bg-[var(--surface)] p-6 backdrop-blur-2xl transition-colors hover:bg-[var(--surface-hi)]">
              <h3 className="mb-3 font-display text-[15px] font-semibold">{g.group}</h3>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
