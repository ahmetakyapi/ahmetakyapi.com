'use client'

import { useRef, useMemo, Suspense, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

/* ═══════════════════════════════════════════════════════════════════════════
   GLSL Simplex Noise
   ═══════════════════════════════════════════════════════════════════════════ */
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

/* ═══════════════════════════════════════════════════════════════════════════
   Elegant Particle Field — 3500 particles, soft white/blue tones
   ═══════════════════════════════════════════════════════════════════════════ */

const PARTICLE_COUNT = 440

const vertexShader = /* glsl */ `
${NOISE_GLSL}

uniform float uTime;
uniform vec2 uMouse;
uniform float uClickWave;
uniform vec2 uClickPos;

attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;
varying float vMouseDist;

void main() {
  vec3 pos = position;

  // Slow organic drift
  float n = snoise(pos * 0.08 + uTime * 0.06);
  float n2 = snoise(pos * 0.12 + uTime * 0.04 + 50.0);
  pos.x += sin(uTime * 0.15 + aPhase) * 0.4 + n * 0.6;
  pos.y += cos(uTime * 0.12 + aPhase * 1.3) * 0.3 + n2 * 0.5;
  pos.z += sin(uTime * 0.08 + aPhase * 0.7) * 0.2;

  // Mouse — smooth fluid repulsion
  vec3 mouseWorld = vec3(uMouse.x * 14.0, uMouse.y * 9.0, 0.0);
  vec3 toMouse = pos - mouseWorld;
  float mouseDist = length(toMouse);
  float repulse = smoothstep(5.0, 0.0, mouseDist);
  pos += normalize(toMouse + 0.001) * repulse * 2.5;

  // Click shockwave — expanding ring
  if (uClickWave > 0.0 && uClickWave < 3.0) {
    vec3 toClick = pos - vec3(uClickPos * vec2(14.0, 9.0), 0.0);
    float clickDist = length(toClick);
    float ringRadius = uClickWave * 6.0;
    float ringWidth = 2.5;
    float inRing = exp(-pow(clickDist - ringRadius, 2.0) / ringWidth);
    float fade = exp(-uClickWave * 1.2);
    pos += normalize(toClick + 0.001) * inRing * fade * 3.0;
  }

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPos;

  // Size — depth-aware with proximity boost
  float depth = -mvPos.z;
  float proximityScale = 1.0 + repulse * 1.5;
  gl_PointSize = aSize * proximityScale * (160.0 / depth);
  gl_PointSize = clamp(gl_PointSize, 0.2, 6.2);

  // Color — subtle brightening near mouse
  vColor = aColor + vec3(0.08, 0.18, 0.24) * repulse;
  vAlpha = smoothstep(50.0, 8.0, depth) * (0.1 + n * 0.04);
  vMouseDist = mouseDist;
}
`

const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
varying float vMouseDist;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  // Soft circular falloff with subtle glow
  float core = smoothstep(0.5, 0.02, d);
  float glow = smoothstep(0.5, 0.15, d) * 0.4;
  float alpha = (core + glow) * vAlpha;

  // Proximity glow boost
  float proxBoost = smoothstep(5.0, 1.0, vMouseDist) * 0.14;
  alpha += proxBoost * core;

  gl_FragColor = vec4(vColor, alpha);
}
`

function ParticleField({
  mouseRef,
  clickRef,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector2>
  clickRef: React.MutableRefObject<{ pos: THREE.Vector2; time: number }>
}) {
  const pointsRef = useRef<THREE.Points>(null!)
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const { positions, sizes, phases, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const sz = new Float32Array(PARTICLE_COUNT)
    const ph = new Float32Array(PARTICLE_COUNT)
    const col = new Float32Array(PARTICLE_COUNT * 3)

    // Soft palette — mostly white/ice with occasional cobalt/mint accents
    const palette = [
      [0.89, 0.93, 0.99],   // soft ice
      [0.72, 0.86, 0.98],   // airy cyan
      [0.61, 0.75, 0.97],   // cool blue
      [0.33, 0.51, 0.96],   // cobalt
      [0.40, 0.90, 0.80],   // mint accent
      [0.95, 0.97, 1.00],   // near white
    ]

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Wide, shallow distribution — like cosmic dust
      const spread = 42
      pos[i * 3] = (Math.random() - 0.5) * spread * 1.6
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18 - 5

      // Most particles small, few larger — power distribution
      sz[i] = 0.45 + Math.pow(Math.random(), 4) * 1.7
      ph[i] = Math.random() * Math.PI * 2

      // Mostly light colors, ~15% get cobalt/mint accents
      const ci = Math.random() < 0.15
        ? 3 + Math.floor(Math.random() * 2)   // cobalt or mint
        : Math.floor(Math.random() * 3)        // white/blue variants
      const brightness = 0.7 + Math.random() * 0.3
      const c = palette[ci]
      col[i * 3] = c[0] * brightness
      col[i * 3 + 1] = c[1] * brightness
      col[i * 3 + 2] = c[2] * brightness
    }

    return { positions: pos, sizes: sz, phases: ph, colors: col }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uClickWave: { value: 0 },
      uClickPos: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    matRef.current.uniforms.uTime.value = t

    // Smooth mouse lerp
    matRef.current.uniforms.uMouse.value.lerp(mouseRef.current, 0.08)

    // Sync click time with Three clock on first frame after click
    if (clickRef.current.time === -1) {
      clickRef.current.time = t
    }

    // Click shockwave
    const clickAge = t - clickRef.current.time
    if (clickAge >= 0 && clickAge < 3) {
      matRef.current.uniforms.uClickWave.value = clickAge
      matRef.current.uniforms.uClickPos.value.copy(clickRef.current.pos)
    } else {
      matRef.current.uniforms.uClickWave.value = 0
    }

    // Very slow field rotation
    pointsRef.current.rotation.y = t * 0.008
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Subtle connection lines — only near cursor, max 120 nodes
   ═══════════════════════════════════════════════════════════════════════════ */

const LINE_COUNT = 12

function ConnectionLines({ mouseRef }: { mouseRef: React.MutableRefObject<THREE.Vector2> }) {
  const lineGeoRef = useRef<THREE.BufferGeometry>(null!)

  const basePositions = useMemo(() => {
    const pos = new Float32Array(LINE_COUNT * 3)
    const ph = new Float32Array(LINE_COUNT)
    for (let i = 0; i < LINE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3
      ph[i] = Math.random() * Math.PI * 2
    }
    return { pos, ph }
  }, [])

  const animPos = useRef(new Float32Array(LINE_COUNT * 3))
  const lineVerts = useRef(new Float32Array(LINE_COUNT * LINE_COUNT * 6))

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const ap = animPos.current
    const bp = basePositions.pos
    const ph = basePositions.ph

    for (let i = 0; i < LINE_COUNT; i++) {
      const idx = i * 3
      ap[idx] = bp[idx] + Math.sin(t * 0.2 + ph[i]) * 1.5
      ap[idx + 1] = bp[idx + 1] + Math.cos(t * 0.18 + ph[i] * 1.3) * 1.0
      ap[idx + 2] = bp[idx + 2] + Math.sin(t * 0.15 + ph[i] * 0.8) * 0.4
    }

    const mouseX = mouseRef.current.x * 14
    const mouseY = mouseRef.current.y * 9
    const lv = lineVerts.current
    let vi = 0
    const threshold = 3.8
    const mouseRadius = 4.8

    for (let i = 0; i < LINE_COUNT; i++) {
      // Only draw lines near mouse
      const mx = ap[i * 3] - mouseX
      const my = ap[i * 3 + 1] - mouseY
      if (mx * mx + my * my > mouseRadius * mouseRadius) continue

      for (let j = i + 1; j < LINE_COUNT; j++) {
        const dx = ap[i * 3] - ap[j * 3]
        const dy = ap[i * 3 + 1] - ap[j * 3 + 1]
        const dz = ap[i * 3 + 2] - ap[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < threshold) {
          lv[vi++] = ap[i * 3]
          lv[vi++] = ap[i * 3 + 1]
          lv[vi++] = ap[i * 3 + 2]
          lv[vi++] = ap[j * 3]
          lv[vi++] = ap[j * 3 + 1]
          lv[vi++] = ap[j * 3 + 2]
        }
      }
    }

    if (lineGeoRef.current) {
      const attr = lineGeoRef.current.getAttribute('position') as THREE.BufferAttribute | undefined
      if (attr) {
        // Reuse existing buffer — no allocation
        ;(attr.array as Float32Array).set(lv.subarray(0, vi))
        attr.needsUpdate = true
      } else {
        lineGeoRef.current.setAttribute('position', new THREE.BufferAttribute(lv.slice(), 3))
      }
      lineGeoRef.current.setDrawRange(0, vi / 3)
    }
  })

  return (
    <lineSegments>
      <bufferGeometry ref={lineGeoRef} />
      <lineBasicMaterial
        color="#67e8f9"
        transparent
        opacity={0.02}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Soft mouse glow — a gentle light following cursor
   ═══════════════════════════════════════════════════════════════════════════ */

function MouseGlow({ mouseRef }: { mouseRef: React.MutableRefObject<THREE.Vector2> }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const target = useRef(new THREE.Vector3(0, 0, 1))

  useFrame(() => {
    target.current.set(mouseRef.current.x * 14, mouseRef.current.y * 9, 1)
    meshRef.current.position.lerp(target.current, 0.06)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 16, 16]} />
      <meshBasicMaterial
        color="#2563eb"
        transparent
        opacity={0.006}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Camera — gentle parallax + breathing
   ═══════════════════════════════════════════════════════════════════════════ */

function CameraRig() {
  useFrame(({ camera, pointer, clock }) => {
    const t = clock.elapsedTime
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.2, 0.025)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.6 + Math.sin(t * 0.15) * 0.2, 0.025)
    camera.position.z = 12 + Math.sin(t * 0.1) * 0.3
    camera.lookAt(0, 0, -3)
  })
  return null
}

/* ═══════════════════════════════════════════════════════════════════════════
   Scene
   ═══════════════════════════════════════════════════════════════════════════ */

function Scene({
  mouseRef,
  clickRef,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector2>
  clickRef: React.MutableRefObject<{ pos: THREE.Vector2; time: number }>
}) {
  return (
    <>
      <ParticleField mouseRef={mouseRef} clickRef={clickRef} />
      <ConnectionLines mouseRef={mouseRef} />
      <MouseGlow mouseRef={mouseRef} />
      <CameraRig />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          intensity={0.6}
        />
      </EffectComposer>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Export
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false)
  const mouseRef = useRef(new THREE.Vector2(999, 999))
  const clickRef = useRef({ pos: new THREE.Vector2(0, 0), time: -10 })
  const pausedRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setMounted(true)

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
    }

    function onClick(e: MouseEvent) {
      const el = e.target as HTMLElement
      if (el.closest('a, button, input, textarea, select, [role="button"], nav, header')) return
      clickRef.current.pos.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
      clickRef.current.time = -1 // will be synced in useFrame
    }

    function onVisibility() {
      pausedRef.current = document.hidden
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('click', onClick)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene mouseRef={mouseRef} clickRef={clickRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
