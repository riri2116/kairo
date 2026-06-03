import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function webglSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch (e) {
    return false;
  }
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uAmp;
  uniform float uSpeed;
  uniform float uSeed;
  uniform float uThick;

  varying vec2  vUv;
  varying float vSlope;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // vertical centre-line of the strand as a function of length
  float centre(float x, float t) {
    float a = snoise(vec3(x * 0.16 + t * 0.30, uSeed, 0.0));
    float b = snoise(vec3(x * 0.34 - t * 0.22, uSeed + 4.0, 0.0)) * 0.45;
    return (a + b) * uAmp;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float t = uTime * uSpeed + uSeed;

    // taper the strand thickness along its length so it reads like silk
    float taper = 0.55 + 0.45 * snoise(vec3(pos.x * 0.22 + t * 0.2, uSeed + 8.0, 0.0));
    pos.y *= uThick * clamp(taper, 0.25, 1.0);

    // sweep the whole strand along a flowing vertical path
    float c0 = centre(pos.x, t);
    pos.y += c0;

    // slope of the path -> used for shading the sheen
    float c1 = centre(pos.x + 0.25, t);
    vSlope = (c1 - c0) * 4.0;

    // depth + silk fold (twist) in z
    float fold = snoise(vec3(pos.x * 0.30 + t * 0.25, uSeed + 2.0, 0.0));
    pos.z += fold * 0.6 + sin(pos.x * 0.4 + t * 0.8) * 0.25;

    // gentle mouse parallax
    pos.y += uMouse.y * 0.30 * sin(pos.x * 0.25 + t);
    pos.z += uMouse.x * 0.30 * cos(pos.x * 0.20 + t);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uSeed;

  varying vec2  vUv;
  varying float vSlope;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    float across = vUv.y;            // 0..1 across the strand thickness
    float along  = vUv.x;            // 0..1 along the strand length
    float t = uTime * uSpeed + uSeed;

    // base gradient across the strand width
    vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 1.0, across));

    // bright travelling silk sheen (the white highlight line)
    float sheenPos = 0.5 + 0.34 * sin(along * 5.5 + t * 0.9);
    sheenPos += vSlope * 0.12;
    float sheen = smoothstep(0.16, 0.0, abs(across - sheenPos));
    col = mix(col, uColorC, sheen * 0.9);

    // soft self-shadow on the far edge for roundness
    float shade = mix(0.86, 1.06, smoothstep(0.0, 0.7, across));
    col *= shade;

    // DEFINED feathered edges (crisp, not blurred)
    float edge = smoothstep(0.0, 0.10, across) * smoothstep(1.0, 0.90, across);
    // dissolve the very ends into the page
    float ends = smoothstep(0.0, 0.05, along) * smoothstep(1.0, 0.95, along);

    // very subtle film grain
    float g = (hash(vUv * vec2(640.0, 360.0) + floor(uTime * 18.0)) * 2.0 - 1.0) * 0.022;
    col += g;

    float alpha = uOpacity * edge * ends;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

function Strand({ cfg, mouse }) {
  const matRef = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAmp: { value: cfg.amp },
      uSpeed: { value: cfg.speed },
      uSeed: { value: cfg.seed },
      uThick: { value: cfg.thick },
      uColorA: { value: new THREE.Color(cfg.a) },
      uColorB: { value: new THREE.Color(cfg.b) },
      uColorC: { value: new THREE.Color(cfg.c) },
      uOpacity: { value: cfg.opacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    const u = matRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMouse.value.lerp(mouse.current, 0.035);
  });

  return (
    <mesh position={[0, cfg.y, cfg.z]} renderOrder={cfg.order}>
      <planeGeometry args={[34, 2.2, 320, 16]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// vivid-but-elegant silk palette: soft blue / warm gold-cream / bright off-white
const STRANDS = [
  { a: '#EBDFBE', b: '#F6ECCF', c: '#FFFFFF', y: 0.0,   z: -2.0, thick: 1.05, amp: 0.85, opacity: 0.5,  speed: 0.10, seed: 34.0, order: 0 },
  { a: '#E7B84A', b: '#F6DF9E', c: '#FFFFFF', y: -0.14, z: -1.2, thick: 0.85, amp: 0.95, opacity: 0.85, speed: 0.12, seed: 2.0,  order: 1 },
  { a: '#2E6BE6', b: '#8FB2F3', c: '#FFFFFF', y: 0.10,  z: -0.5, thick: 0.60, amp: 1.02, opacity: 0.92, speed: 0.15, seed: 7.0,  order: 2 },
  { a: '#EFEFFA', b: '#FFFFFF', c: '#FFFFFF', y: 0.0,   z: 0.2,  thick: 0.26, amp: 1.10, opacity: 0.80, speed: 0.18, seed: 13.0, order: 3 },
  { a: '#3B73E8', b: '#A6C2F6', c: '#FFFFFF', y: 0.16,  z: 0.6,  thick: 0.40, amp: 1.00, opacity: 0.9,  speed: 0.17, seed: 29.0, order: 4 },
  { a: '#E8C25A', b: '#F8E7AE', c: '#FFFFFF', y: -0.18, z: 0.9,  thick: 0.34, amp: 0.92, opacity: 0.88, speed: 0.14, seed: 21.0, order: 5 },
];

function Scene({ mouse }) {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.20) * 0.10;
      group.current.rotation.z = -0.03 + Math.sin(t * 0.12) * 0.018;
    }
  });

  return (
    <group ref={group} rotation={[-0.08, 0, -0.03]}>
      {STRANDS.map((cfg) => (
        <Strand key={cfg.seed} cfg={cfg} mouse={mouse} />
      ))}
    </group>
  );
}

export default function RibbonScene() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const reduced = useRef(false);
  const [supported] = useState(() => webglSupported());

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onMove = (e) => {
      if (reduced.current) return;
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  if (!supported) return <div className="ribbon-fallback" />;

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8], fov: 30 }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
      }}
    >
      <Scene mouse={mouse} />
    </Canvas>
  );
}
