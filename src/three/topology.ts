import * as THREE from 'three'
import { AMBER, CYAN, GREEN, VIOLET, dotTexture, label, type Build } from './stage'

const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const

interface Node { name: string; x: number; z: number; h: number; color: THREE.Color }

// Tiers laid out front (edge) -> back (data)
const TIERS: Node[][] = [
  [{ name: 'Cloudflare', x: 0, z: 4.2, h: 0.5, color: AMBER }],
  [{ name: 'nginx-01', x: -1.6, z: 2.2, h: 0.9, color: CYAN }, { name: 'nginx-02', x: 1.6, z: 2.2, h: 0.9, color: CYAN }],
  [
    { name: 'api', x: -3.3, z: 0, h: 1.3, color: CYAN }, { name: 'wallet', x: -1.1, z: 0, h: 1.3, color: CYAN },
    { name: 'payment', x: 1.1, z: 0, h: 1.3, color: CYAN }, { name: 'worker', x: 3.3, z: 0, h: 1.3, color: CYAN },
  ],
  [
    { name: 'postgres', x: -2.2, z: -2.3, h: 1.6, color: VIOLET }, { name: 'redis', x: 0, z: -2.3, h: 1.0, color: VIOLET },
    { name: 'kafka', x: 2.2, z: -2.3, h: 1.6, color: VIOLET },
  ],
]
const MON = { name: 'prometheus', x: 5.6, z: -0.6, h: 2.4 }

/** Production topology: edge -> LB -> services -> data, with packets, monitoring sweep and a self-healing incident loop. */
const build: Build = ({ scene, camera, mouse, emit }) => {
  camera.fov = 38
  camera.updateProjectionMatrix()
  const world = new THREE.Group()
  scene.add(world)

  const grid = new THREE.GridHelper(22, 44, 0x0e7490, 0x0b1c33)
  ;(grid.material as THREE.Material).transparent = true
  ;(grid.material as THREE.Material).opacity = 0.35
  world.add(grid)

  const racks: { node: Node; mesh: THREE.Mesh; edge: THREE.LineBasicMaterial; leds: THREE.MeshBasicMaterial[]; top: THREE.Vector3 }[] = []
  const makeRack = (node: Node) => {
    const w = 0.9, d = 0.9
    const g = new THREE.Group()
    g.position.set(node.x, 0, node.z)
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(w, node.h, d),
      new THREE.MeshBasicMaterial({ color: 0x050b1a, transparent: true, opacity: 0.92 }),
    )
    body.position.y = node.h / 2
    g.add(body)
    const edge = new THREE.LineBasicMaterial({ color: node.color, transparent: true, opacity: 0.85 })
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), edge)
    lines.position.copy(body.position)
    g.add(lines)
    // LED slots on the front face
    const leds: THREE.MeshBasicMaterial[] = []
    const slots = Math.max(2, Math.round(node.h / 0.28))
    for (let i = 0; i < slots; i++) {
      const m = new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.9 })
      const led = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.62, 0.05), m)
      led.position.set(0, 0.16 + i * ((node.h - 0.26) / Math.max(1, slots - 1)), d / 2 + 0.002)
      g.add(led)
      leds.push(m)
    }
    // Footprint glow
    const foot = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 1.8),
      new THREE.MeshBasicMaterial({ ...additive, map: dotTexture(), color: node.color, opacity: 0.5 }),
    )
    foot.rotation.x = -Math.PI / 2
    foot.position.y = 0.01
    g.add(foot)
    const tag = label(node.name)
    tag.position.set(0, node.h + 0.38, 0)
    g.add(tag)
    world.add(g)
    const r = { node, mesh: body, edge, leds, top: new THREE.Vector3(node.x, node.h, node.z) }
    racks.push(r)
    return r
  }
  const tiers = TIERS.map(t => t.map(makeRack))

  // Monitoring tower + scanning ring
  const mon = makeRack({ ...MON, color: GREEN })
  const scan = new THREE.Mesh(
    new THREE.RingGeometry(0.2, 0.26, 64),
    new THREE.MeshBasicMaterial({ ...additive, color: GREEN, side: THREE.DoubleSide }),
  )
  scan.rotation.x = -Math.PI / 2
  scan.position.set(MON.x, 0.02, MON.z)
  world.add(scan)

  // Links between adjacent tiers (floor-level curves)
  interface Link { curve: THREE.CatmullRomCurve3; mat: THREE.LineBasicMaterial; to: number }
  const links: Link[] = []
  const linkLine = (a: THREE.Vector3, b: THREE.Vector3, color: THREE.Color, opacity: number) => {
    const mid = a.clone().lerp(b, 0.5)
    mid.y += 0.5
    const curve = new THREE.CatmullRomCurve3([a, mid, b])
    const mat = new THREE.LineBasicMaterial({ ...additive, color, opacity })
    world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)), mat))
    return { curve, mat }
  }
  for (let i = 0; i < tiers.length - 1; i++) {
    for (const a of tiers[i]) for (const b of tiers[i + 1]) {
      if (i === 2 && Math.abs(a.node.x - b.node.x) > 3.4) continue // keep data tier readable
      const pa = new THREE.Vector3(a.node.x, 0.05, a.node.z)
      const pb = new THREE.Vector3(b.node.x, 0.05, b.node.z)
      const l = linkLine(pa, pb, CYAN, 0.28)
      links.push({ ...l, to: racks.indexOf(b) })
    }
  }
  // Scrape lines from prometheus to the service tier
  for (const s of tiers[2]) {
    linkLine(new THREE.Vector3(MON.x, MON.h, MON.z), s.top.clone(), GREEN, 0.12)
  }

  // Packets
  const N = 90
  const pkt = Array.from({ length: N }, () => ({ l: (Math.random() * links.length) | 0, u: Math.random(), s: 0.35 + Math.random() * 0.5 }))
  const pos = new Float32Array(N * 3)
  const pg = new THREE.BufferGeometry()
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const packets = new THREE.Points(pg, new THREE.PointsMaterial({ ...additive, size: 0.22, color: 0xcff8ff, map: dotTexture() }))
  packets.frustumCulled = false
  world.add(packets)

  // Incident loop: a service degrades -> alert -> auto-heal
  const services = tiers[2]
  let victim = -1
  let phaseT = 0
  let phase: 'ok' | 'down' | 'heal' = 'ok'
  const tmp = new THREE.Vector3()
  const setRack = (r: (typeof racks)[number], c: THREE.Color) => {
    r.edge.color.copy(c)
    r.leds.forEach(m => m.color.copy(c === r.node.color ? GREEN : c))
  }
  emit('all systems operational · 11 targets up')

  return (t, dt) => {
    // Camera: slow orbit + pointer parallax
    const ang = Math.sin(t * 0.08) * 0.35 + mouse.x * 0.25 - 0.55
    const dist = camera.aspect < 1 ? 20 : 15.5
    camera.position.set(Math.sin(ang) * dist, 8.2 + mouse.y * 1.2, Math.cos(ang) * dist)
    camera.lookAt(0.6, 0.4, 0.2)

    // Blink LEDs
    racks.forEach((r, i) => r.leds.forEach((m, k) => (m.opacity = 0.35 + 0.65 * (Math.sin(t * (3 + ((i + k) % 5)) + k * 1.7) > -0.2 ? 1 : 0.2))))

    // Monitoring sweep
    const s = (t * 0.5) % 1
    scan.scale.setScalar(1 + s * 18)
    ;(scan.material as THREE.MeshBasicMaterial).opacity = (1 - s) * 0.5

    // Incident state machine
    phaseT += dt
    if (phase === 'ok' && phaseT > 7) {
      victim = (Math.random() * services.length) | 0
      phase = 'down'; phaseT = 0
      setRack(services[victim], AMBER)
      emit(`ALERT ${services[victim].node.name}: p95 latency > 2s → paging on-call`)
    } else if (phase === 'down' && phaseT > 2.6) {
      phase = 'heal'; phaseT = 0
      emit(`auto-heal: restarting ${services[victim].node.name} container…`)
    } else if (phase === 'heal' && phaseT > 2) {
      setRack(services[victim], services[victim].node.color)
      emit(`resolved · ${services[victim].node.name} healthy · MTTR ${(4.6).toFixed(1)}s`)
      phase = 'ok'; phaseT = 0
    }
    if (phase !== 'ok') services[victim].edge.opacity = 0.4 + 0.6 * Math.abs(Math.sin(t * 8))
    else racks.forEach(r => (r.edge.opacity = 0.85))
    mon.edge.opacity = 0.6 + 0.4 * Math.sin(t * 3)

    // Packets — avoid the degraded node while it is down
    pkt.forEach((p, i) => {
      p.u += dt * p.s
      if (p.u >= 1) {
        p.u = 0
        do p.l = (Math.random() * links.length) | 0
        while (phase !== 'ok' && links[p.l].to === racks.indexOf(services[victim]))
      }
      links[p.l].curve.getPoint(p.u, tmp).toArray(pos, i * 3)
    })
    pg.attributes.position.needsUpdate = true
  }
}

export default build
