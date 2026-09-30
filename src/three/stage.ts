import * as THREE from 'three'

// Palette — keep in sync with --cyan / --violet in index.css
export const CYAN = new THREE.Color(0x00d4ff)
export const VIOLET = new THREE.Color(0x8b5cf6)
export const AMBER = new THREE.Color(0xf59e0b)
export const GREEN = new THREE.Color(0x4ade80)

export interface Stage {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  /** Smoothed pointer position, -1..1 on both axes (window-relative). */
  mouse: { x: number; y: number }
  /** Sends a message to the host element as a `stage` CustomEvent. */
  emit: (msg: string) => void
}
export type Frame = (t: number, dt: number) => void
export type Build = (s: Stage) => Frame

let dot: THREE.Texture | null = null
/** Soft round sprite used by every Points material. */
export function dotTexture() {
  if (dot) return dot
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(255,255,255,0.8)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  dot = new THREE.CanvasTexture(c)
  return dot
}

/** Canvas-text sprite label. */
export function label(text: string, color = '#7dd3fc') {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 96
  const g = c.getContext('2d')!
  g.font = '600 40px "JetBrains Mono", ui-monospace, monospace'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = color
  g.fillText(text, 256, 48)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.85 }))
  s.scale.set(2.4, 0.45, 1)
  return s
}

/**
 * Mounts a WebGL canvas into `host`, runs `build` once and then its frame fn every rAF.
 * Pauses when off-screen, renders a single still frame under prefers-reduced-motion.
 * Returns a dispose function.
 */
export function runStage(host: HTMLElement, build: Build) {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return () => {} // no WebGL — page still works without the 3D layer
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  const canvas = renderer.domElement
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
  host.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200)
  const mouse = { x: 0, y: 0 }
  const target = { x: 0, y: 0 }
  const emit = (msg: string) => host.dispatchEvent(new CustomEvent('stage', { detail: msg }))
  const frame = build({ scene, camera, mouse, emit })

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let raf = 0
  let running = false
  let t = 0
  let last = 0

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    if (!running) { frame(t, 0); renderer.render(scene, camera) }
  }
  const ro = new ResizeObserver(resize)
  ro.observe(host)
  resize()

  const onMove = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1
    target.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    t += dt
    mouse.x += (target.x - mouse.x) * 0.05
    mouse.y += (target.y - mouse.y) * 0.05
    frame(t, dt)
    renderer.render(scene, camera)
  }
  const start = () => {
    if (running) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }
  const stop = () => { running = false; cancelAnimationFrame(raf) }

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
  if (reduced) { t = 3; resize() } else io.observe(host)

  return () => {
    stop()
    io.disconnect()
    ro.disconnect()
    window.removeEventListener('pointermove', onMove)
    scene.traverse(o => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      const mat = m.material
      ;(Array.isArray(mat) ? mat : [mat]).forEach(x => x?.dispose())
    })
    renderer.dispose()
    canvas.remove()
  }
}
