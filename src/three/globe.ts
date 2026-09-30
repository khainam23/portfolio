import * as THREE from 'three'
import { CYAN, VIOLET, dotTexture, type Build } from './stage'

const R = 2.3
const NODES = 76 // one per production server
const ARCS = 34

const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const

/** Hero: wireframe planet of server nodes with data arcs, packets and orbiting satellites. */
const build: Build = ({ scene, camera, mouse }) => {
  camera.fov = 42
  camera.position.set(0, 0, 8.6)
  camera.updateProjectionMatrix()

  const tilt = new THREE.Group()
  scene.add(tilt)
  const spin = new THREE.Group()
  tilt.add(spin)

  // Opaque core hides the back hemisphere -> real depth
  spin.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 48, 48), new THREE.MeshBasicMaterial({ color: 0x030713 })))
  spin.add(new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(R, 2)),
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.13 }),
  ))

  const vert = `varying vec3 vN; varying vec3 vV;
    void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
      vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv; }`
  // Rim light on the surface
  tilt.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.002, 64, 64), new THREE.ShaderMaterial({
    ...additive,
    uniforms: { c1: { value: CYAN }, c2: { value: VIOLET } },
    vertexShader: vert,
    fragmentShader: `uniform vec3 c1; uniform vec3 c2; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.0);
        gl_FragColor = vec4(mix(c1, c2, vN.y * 0.5 + 0.5) * f * 0.9, 1.0); }`,
  })))
  // Outer atmosphere halo
  tilt.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.18, 64, 64), new THREE.ShaderMaterial({
    ...additive,
    side: THREE.BackSide,
    uniforms: { c1: { value: CYAN }, c2: { value: VIOLET } },
    vertexShader: vert,
    fragmentShader: `uniform vec3 c1; uniform vec3 c2; varying vec3 vN; varying vec3 vV;
      void main(){ float i = pow(max(0.62 - dot(vN, vec3(0.0,0.0,1.0)), 0.0), 3.0);
        gl_FragColor = vec4(mix(c1, c2, 0.4) * i * 0.45, 1.0); }`,
  })))

  // Server nodes on a fibonacci sphere
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < NODES; i++) {
    const y = 1 - (i / (NODES - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = i * Math.PI * (3 - Math.sqrt(5))
    pts.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(R * 1.006))
  }
  const nodeGeo = new THREE.BufferGeometry().setFromPoints(pts)
  const cols = new Float32Array(NODES * 3)
  pts.forEach((p, i) => CYAN.clone().lerp(VIOLET, (p.y / R + 1) / 2).toArray(cols, i * 3))
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
  spin.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({ ...additive, size: 0.17, map: dotTexture(), vertexColors: true })))

  const hubMat = new THREE.PointsMaterial({ ...additive, size: 0.36, map: dotTexture(), color: 0x9ff0ff })
  spin.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts.filter((_, i) => i % 11 === 5)), hubMat))

  // Data arcs between nodes
  const arcs: THREE.QuadraticBezierCurve3[] = []
  const arcMat = new THREE.LineBasicMaterial({ ...additive, vertexColors: true, opacity: 0.5 })
  for (let guard = 0; arcs.length < ARCS && guard < 5000; guard++) {
    const a = pts[(Math.random() * NODES) | 0]
    const b = pts[(Math.random() * NODES) | 0]
    const d = a.distanceTo(b)
    if (d < 1.2 || d > 3.4) continue
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R + d * 0.4)
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
    arcs.push(curve)
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48))
    const c = new Float32Array(49 * 3)
    for (let k = 0; k <= 48; k++) CYAN.clone().lerp(VIOLET, k / 48).toArray(c, k * 3)
    g.setAttribute('color', new THREE.BufferAttribute(c, 3))
    spin.add(new THREE.Line(g, arcMat))
  }

  // Packets travelling along the arcs
  const pk = arcs.map(() => ({ u: Math.random(), speed: 0.22 + Math.random() * 0.35 }))
  const pkPos = new Float32Array(arcs.length * 3)
  const pkGeo = new THREE.BufferGeometry()
  pkGeo.setAttribute('position', new THREE.BufferAttribute(pkPos, 3))
  const packets = new THREE.Points(pkGeo, new THREE.PointsMaterial({ ...additive, size: 0.15, color: 0xe6fcff, map: dotTexture() }))
  packets.frustumCulled = false
  spin.add(packets)

  // Orbit rings with satellites
  const rings = [
    { r: R * 1.45, rot: [1.25, 0.25, 0], speed: 0.45 },
    { r: R * 1.7, rot: [1.85, -0.55, 0.4], speed: -0.28 },
  ].map(cfg => {
    const g = new THREE.Group()
    g.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2])
    tilt.add(g)
    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, cfg.r, cfg.r).getPoints(160).map(p => new THREE.Vector3(p.x, p.y, 0)),
      ),
      new THREE.LineDashedMaterial({ color: CYAN, dashSize: 0.07, gapSize: 0.11, transparent: true, opacity: 0.35 }),
    )
    ring.computeLineDistances()
    g.add(ring)
    const pivot = new THREE.Group()
    g.add(pivot)
    pivot.add(new THREE.Points(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(cfg.r, 0, 0)]),
      new THREE.PointsMaterial({ ...additive, size: 0.28, color: 0xffffff, map: dotTexture() }),
    ))
    return { pivot, speed: cfg.speed }
  })

  // Distant star field
  const starPos = new Float32Array(700 * 3)
  for (let i = 0; i < 700; i++) {
    new THREE.Vector3().randomDirection().multiplyScalar(14 + Math.random() * 26).toArray(starPos, i * 3)
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ ...additive, size: 0.14, color: 0x7dd3fc, map: dotTexture(), opacity: 0.55 }))
  scene.add(stars)

  const tmp = new THREE.Vector3()
  return (t, dt) => {
    spin.rotation.y += dt * 0.09
    tilt.rotation.x = 0.3 + mouse.y * 0.12
    tilt.rotation.y = mouse.x * 0.25
    tilt.rotation.z = 0.22
    hubMat.size = 0.36 + Math.sin(t * 2.2) * 0.07
    pk.forEach((p, i) => {
      p.u = (p.u + dt * p.speed) % 1
      arcs[i].getPoint(p.u, tmp).toArray(pkPos, i * 3)
    })
    pkGeo.attributes.position.needsUpdate = true
    rings.forEach(r => (r.pivot.rotation.z = t * r.speed))
    stars.rotation.y = t * 0.008
  }
}

export default build
