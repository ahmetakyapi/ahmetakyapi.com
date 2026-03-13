'use client'

import { useRef, useMemo, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from 'next-themes'

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
   Particle Field
   ═══════════════════════════════════════════════════════════════════════════ */

const PARTICLE_COUNT = 200

const vertexShader = /* glsl */ `
${NOISE_GLSL}

uniform float uTime;
uniform float uAlphaScale;

attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 pos = position;

  float n = snoise(pos * 0.08 + uTime * 0.06);
  float n2 = snoise(pos * 0.12 + uTime * 0.04 + 50.0);
  pos.x += sin(uTime * 0.15 + aPhase) * 0.4 + n * 0.6;
  pos.y += cos(uTime * 0.12 + aPhase * 1.3) * 0.3 + n2 * 0.5;
  pos.z += sin(uTime * 0.08 + aPhase * 0.7) * 0.2;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPos;

  float depth = -mvPos.z;
  gl_PointSize = aSize * (160.0 / depth);
  gl_PointSize = clamp(gl_PointSize, 0.2, 6.2);

  vColor = aColor;
  vAlpha = smoothstep(50.0, 8.0, depth) * (0.1 + n * 0.04) * uAlphaScale;
}
`

const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  float core = smoothstep(0.5, 0.02, d);
  float glow = smoothstep(0.5, 0.15, d) * 0.4;
  float alpha = (core + glow) * vAlpha;

  gl_FragColor = vec4(vColor, alpha);
}
`

/* Colour palettes */
const DARK_PALETTE = [
  [0.89, 0.93, 0.99],
  [0.72, 0.86, 0.98],
  [0.61, 0.75, 0.97],
  [0.33, 0.51, 0.96],
  [0.40, 0.90, 0.80],
  [0.95, 0.97, 1.00],
]

const LIGHT_PALETTE = [
  [0.27, 0.33, 0.62],
  [0.22, 0.30, 0.72],
  [0.18, 0.26, 0.58],
  [0.12, 0.20, 0.50],
  [0.30, 0.48, 0.75],
  [0.35, 0.40, 0.65],
]

function ParticleField({ isLight }: { isLight: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const { positions, sizes, phases, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const sz = new Float32Array(PARTICLE_COUNT)
    const ph = new Float32Array(PARTICLE_COUNT)
    const col = new Float32Array(PARTICLE_COUNT * 3)

    const palette = isLight ? LIGHT_PALETTE : DARK_PALETTE

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const spread = 42
      pos[i * 3] = (Math.random() - 0.5) * spread * 1.6
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18 - 5

      sz[i] = 0.45 + Math.pow(Math.random(), 4) * 1.7
      ph[i] = Math.random() * Math.PI * 2

      const ci = Math.random() < 0.15
        ? 3 + Math.floor(Math.random() * 2)
        : Math.floor(Math.random() * 3)
      const brightness = isLight ? 0.7 + Math.random() * 0.25 : 0.7 + Math.random() * 0.3
      const c = palette[ci]
      col[i * 3] = c[0] * brightness
      col[i * 3 + 1] = c[1] * brightness
      col[i * 3 + 2] = c[2] * brightness
    }

    return { positions: pos, sizes: sz, phases: ph, colors: col }
  }, [isLight])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAlphaScale: { value: isLight ? 2.8 : 1.0 },
    }),
    [isLight],
  )

  useEffect(() => {
    if (!matRef.current) return
    matRef.current.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending
    matRef.current.uniforms.uAlphaScale.value = isLight ? 2.8 : 1.0
    matRef.current.needsUpdate = true
  }, [isLight])

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.elapsedTime
    pointsRef.current.rotation.y = clock.elapsedTime * 0.008
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
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Camera — gentle oscillation only, no mouse tracking
   ═══════════════════════════════════════════════════════════════════════════ */

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.sin(t * 0.15) * 0.2, 0.025)
    camera.position.z = 12 + Math.sin(t * 0.1) * 0.3
    camera.lookAt(0, 0, -3)
  })
  return null
}

/* ═══════════════════════════════════════════════════════════════════════════
   Export
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const [themeReady, setThemeReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setMounted(true)
  }, [])

  useEffect(() => {
    if (resolvedTheme) setThemeReady(true)
  }, [resolvedTheme])

  if (!mounted || !themeReady) return null

  const isLight = resolvedTheme !== 'dark'

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
      <Canvas
        key={isLight ? 'light' : 'dark'}
        camera={{ position: [0, 0, 12], fov: 55, near: 0.1, far: 80 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        dpr={1}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ParticleField isLight={isLight} />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  )
}
