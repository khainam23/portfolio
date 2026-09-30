import Scene3D from '../components/Scene3D'
import LogFeed from '../components/ui/LogFeed'
import SectionHeader from '../components/ui/SectionHeader'
import { useLog } from '../hooks/useLog'
import pipeline from '../three/pipeline'
import topology from '../three/topology'

export default function Infra() {
  const [topoLog, pushTopo] = useLog(5)
  const [ciLog, pushCi] = useLog(4)
  return (
    <section id="infra" className="py-24">
      <div className="mx-auto max-w-[1160px] px-7">
        <SectionHeader
          title={<>Production, <em>visualized</em></>}
          desc="A live sketch of the kind of systems I run: edge → load balancers → services → data, watched by Prometheus and healed automatically."
        />

        <div className="glass reveal-up rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-3.5 font-mono text-xs text-faint">
            <span><span className="text-cyan">cluster</span> / prod-ap-southeast</span>
            <span className="flex items-center gap-2"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#4ade80]" /> monitoring: prometheus · grafana · uptime-kuma</span>
          </div>
          <div className="relative">
            <Scene3D build={topology} onMessage={pushTopo} className="h-[440px] md:h-[520px]" />
            <LogFeed lines={topoLog} className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[430px]" />
          </div>
        </div>

        <div className="glass reveal-up mt-5 rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-3.5 font-mono text-xs text-faint">
            <span><span className="text-cyan">pipeline</span> / jenkins · github-actions</span>
            <span>dev → qa → prod</span>
          </div>
          <div className="grid items-stretch lg:grid-cols-[1fr_340px]">
            <Scene3D build={pipeline} onMessage={pushCi} className="h-[260px]" />
            <div className="border-t border-line p-4 lg:border-t-0 lg:border-l">
              <LogFeed lines={ciLog} className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
