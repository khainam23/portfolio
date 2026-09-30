export default function Footer({ name, github }: { name: string; github: string }) {
  return (
    <footer className="border-t border-line bg-[rgba(2,4,14,0.7)] py-7 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1160px] flex-col items-center justify-between gap-3 px-7 text-center md:flex-row">
        <span className="font-mono text-xs text-faint">
          <span className="text-cyan">uptime</span> = 99.9% · built with React + Tailwind
        </span>
        <p className="text-[13px] text-faint">
          © {new Date().getFullYear()} {name} ·{' '}
          <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan">
            github/khainam23
          </a>
        </p>
      </div>
    </footer>
  )
}
