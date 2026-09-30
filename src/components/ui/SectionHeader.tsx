import type { ReactNode } from 'react'

export default function SectionHeader({ title, desc }: { title: ReactNode; desc?: string }) {
  return (
    <div className="reveal-up overline mb-14 text-center">
      <h2 className="section-title mb-3.5">{title}</h2>
      {desc && <p className="mx-auto max-w-[540px] leading-7 text-muted">{desc}</p>}
    </div>
  )
}
