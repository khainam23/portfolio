import * as THREE from 'three'
import { CYAN, GREEN, VIOLET, dotTexture, label, type Build } from './stage'

const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const
const STAGES = ['commit', 'build', 'test', 'scan', 'push', 'deploy']
const GAP = 2.2

/** CI/CD pipeline: a build artifact flies through stage gates that light up as it passes. */
const build: Build = ({ scene, camera, mouse, emit }) => {
  camera.fov = 35
  camera.updateProjectionMatrix()
  const x0 = -((STAGES.length - 1) * GAP) / 2

  const rail = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x0 - 2, 0, 0), new THREE.Vector3(-x0 + 2, 0, 0)]),
    new THREE.LineDashedMaterial({ color: CYAN, dashSize: 0.12, gapSize: 0.12, transparent: true, opacity: 0.35 }),
  )
  rail.computeLineDistances()
  scene.add(rail)

  const gates = STAGES.map((name, i) => {
    const c = CYAN.clone().lerp(VIOLET, i / (STAGES.length - 1))
    const g = new THREE.Group()
    g.position.x = x0 + i * GAP
    g.rotation.y = Math.PI / 2
    const mat = new THREE.MeshBasicMaterial({ ...additive, color: c, opacity: 0.35 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.025, 12, 72), mat)
    g.add(ring)
    const hex = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.85, 0.85, 0.02, 6)),
      new THREE.LineBasicMaterial({ ...additive, color: c, opacity: 0.25 }),
    )
    hex.rotation.x = Math.PI / 2
    g.add(hex)
    scene.add(g)
    const tag = label(name) // sprite stays camera-facing, so keep it outside the rotated gate
    tag.scale.set(1.9, 0.36, 1)
    tag.position.set(x0 + i * GAP, -1.15, 0)
    scene.add(tag)
    return { g, ring, hex, mat, base: c, flash: 0 }
  })

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.34, 0.34),
    new THREE.MeshBasicMaterial({ color: 0x0a1630 }),
  )
  const cubeEdge = new THREE.LineSegments(new THREE.EdgesGeometry(cube.geometry), new THREE.LineBasicMaterial({ color: 0xcffaff }))
  cube.add(cubeEdge)
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ ...additive, map: dotTexture(), color: CYAN }))
  glow.scale.setScalar(1.6)
  cube.add(glow)
  scene.add(cube)

  // Trail
  const T = 40
  const trail = new Float32Array(T * 3)
  const tg = new THREE.BufferGeometry()
  tg.setAttribute('position', new THREE.BufferAttribute(trail, 3))
  const trailPts = new THREE.Points(tg, new THREE.PointsMaterial({ ...additive, size: 0.12, color: CYAN, map: dotTexture(), opacity: 0.6 }))
  trailPts.frustumCulled = false
  scene.add(trailPts)

  let x = x0 - 2
  let passed = -1
  let run = 1
  const TOTAL = (STAGES.length - 1) * GAP + 4
  emit(`#${run} ▸ waiting for commit…`)

  return (t, dt) => {
    camera.position.set(mouse.x * 1.5, 1.6 + mouse.y * 0.6, 9.5 + (camera.aspect < 1 ? 7 : 0))
    camera.lookAt(0, -0.2, 0)

    x += dt * 2.1
    if (x > x0 - 2 + TOTAL) {
      x = x0 - 2; passed = -1; run++
      emit(`#${run} ▸ new commit on main`)
    }
    const next = Math.floor((x - x0) / GAP + 0.5)
    if (next > passed && next < STAGES.length && x >= x0 + next * GAP) {
      passed = next
      gates[next].flash = 1
      const s = STAGES[next]
      emit(next === STAGES.length - 1 ? `#${run} ▸ deploy ✓ prod healthy · rollout 100%` : `#${run} ▸ ${s} ✓ passed`)
    }
    cube.position.set(x, Math.sin(t * 3) * 0.06, 0)
    cube.rotation.set(t * 1.3, t * 1.7, 0)

    for (let i = T - 1; i > 0; i--) { trail[i * 3] = trail[(i - 1) * 3]; trail[i * 3 + 1] = trail[(i - 1) * 3 + 1]; trail[i * 3 + 2] = 0 }
    trail[0] = x; trail[1] = cube.position.y
    tg.attributes.position.needsUpdate = true

    gates.forEach((gt, i) => {
      gt.flash = Math.max(0, gt.flash - dt * 1.2)
      const done = i <= passed
      gt.mat.color.copy(done ? GREEN : gt.base).lerp(new THREE.Color(1, 1, 1), gt.flash * 0.6)
      gt.mat.opacity = (done ? 0.75 : 0.3) + gt.flash * 0.25
      gt.ring.scale.setScalar(1 + gt.flash * 0.35)
      gt.hex.rotation.y = t * 0.4 * (i % 2 ? 1 : -1)
    })
  }
}

export default build
