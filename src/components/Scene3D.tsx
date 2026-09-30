import { useEffect, useRef } from 'react'
import { runStage, type Build } from '../three/stage'
import { cn } from '../lib/utils'

/** Hosts a three.js scene. `onMessage` receives strings the scene emits (status logs). */
export default function Scene3D({ build, className, onMessage }: { build: Build; className?: string; onMessage?: (m: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const cb = useRef(onMessage)
  cb.current = onMessage

  useEffect(() => {
    const host = ref.current!
    const on = (e: Event) => cb.current?.((e as CustomEvent<string>).detail)
    host.addEventListener('stage', on)
    const dispose = runStage(host, build)
    return () => { host.removeEventListener('stage', on); dispose() }
  }, [build])

  return <div ref={ref} className={cn('relative', className)} aria-hidden="true" />
}
