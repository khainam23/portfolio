import { cn } from '../../lib/utils'

/** Terminal-style tail of the last few log lines. */
export default function LogFeed({ lines, className }: { lines: { id: number; text: string }[]; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-line bg-[rgba(2,6,18,0.78)] p-4 font-mono text-[11.5px] leading-6 backdrop-blur-xl', className)}>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#f87171]/70" />
        <span className="h-2 w-2 rounded-full bg-[#fbbf24]/70" />
        <span className="h-2 w-2 rounded-full bg-[#4ade80]/70" />
        <span className="ml-2 text-faint">tail -f events.log</span>
      </div>
      {lines.map((l, i) => (
        <div
          key={l.id}
          className={cn(
            'truncate transition-opacity',
            /ALERT/.test(l.text) ? 'text-[#fbbf24]' : /resolved|✓/.test(l.text) ? 'text-[#4ade80]' : 'text-muted',
          )}
          style={{ opacity: 0.35 + (0.65 * (i + 1)) / lines.length }}
        >
          <span className="text-faint">{'>'}</span> {l.text}
        </div>
      ))}
    </div>
  )
}
