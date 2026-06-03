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

  varying vec2  vUv;
  varying float vElev;

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

  void main() {
    vUv = uv;
    vec3 pos = position;
    float t = uTime * uSpeed + uSeed;

    // layered organic flow along the ribbon length
    float w1 = snoise(vec3(pos.x * 0.16 + t * 0.55, pos.y * 0.35, uSeed));
    float w2 = snoise(vec3(pos.x * 0.34 - t * 0.40, pos.y * 0.22 + 5.0, uSeed * 0.5 + t * 0.18));
    float w3 = snoise(vec3(pos.x * 0.72 + t * 0.22, pos.y * 0.55, uSeed + 12.0));
    float wave = w1 * 0.62 + w2 * 0.30 + w3 * 0.12;

    // silk twist so the fabric folds over itself
    float twist = sin(pos.x * 0.45 + t * 0.7) * 0.5;

    pos.z += wave * uAmp + twist * 0.45;
    pos.y += wave * 0.28;

    // gentle mouse parallax
    pos.z += uMouse.y * 0.45 * sin(pos.x * 0.3 + t);
    pos.y += uMouse.x * 0.16 * cos(pos.x * 0.2 + t);

    vElev = wave + twist * 0.3;
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

  varying vec2  vUv;
  varying float vElev;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    float m = smoothstep(-0.85, 0.85, vElev);

    vec3 col = mix(uColorA, uColorB, m);

    // silk sheen on the crests
    float sheen = smoothstep(0.55, 1.0, m);
    col = mix(col, uColorC, sheen * 0.7);

    // soft shadow in the troughs for depth
    float shade = smoothstep(0.0, 0.4, m);
    col *= mix(0.80, 1.04, shade);

    // feather the long edges of the strip
    float edge = smoothstep(0.0, 0.26, vUv.y) * smoothstep(1.0, 0.74, vUv.y);
    // fade the horizontal ends so it dissolves into the page
    float ends = smoothstep(0.0, 0.10, vUv.x) * smoothstep(1.0, 0.90, vUv.x);

    // fine film grain
    float g = (hash(vUv * vec2(920.0, 540.0) + floor(uTime * 24.0)) * 2.0 - 1.0) * 0.045;
    col += g;

    float alpha = uOpacity * edge * ends;
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

function Ribbon({ colorA, colorB, colorC, opacity, amp, speed, seed, z, mouse, renderOrder }) {
  const matRef = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAmp: { value: amp },
      uSpeed: { value: speed },
      uSeed: { value: seed },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uColorC: { value: new THREE.Color(colorC) },
      uOpacity: { value: opacity },
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
    <mesh position={[0, 0, z]} renderOrder={renderOrder}>
      <planeGeometry args={[30, 3.6, 260, 52]} />
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

function Scene({ mouse }) {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.22) * 0.12;
      group.current.rotation.z = -0.05 + Math.sin(t * 0.13) * 0.025;
    }
  });

  const blue = '#5E8DE6';
  const cream = '#F1DCA7';
  const off = '#FCFAF5';

  return (
    <group ref={group} rotation={[-0.14, 0, -0.05]}>
      {/* back, blurred translucent layer */}
      <Ribbon
        mouse={mouse} renderOrder={0} z={-1.6}
        colorA={cream} colorB={off} colorC={off}
        opacity={0.32} amp={1.25} speed={0.10} seed={3.0}
      />
      {/* mid layer */}
      <Ribbon
        mouse={mouse} renderOrder={1} z={-0.6}
        colorA={blue} colorB={cream} colorC={off}
        opacity={0.55} amp={1.0} speed={0.13} seed={9.0}
      />
      {/* crisp front layer */}
      <Ribbon
        mouse={mouse} renderOrder={2} z={0.4}
        colorA={blue} colorB={cream} colorC={off}
        opacity={0.92} amp={0.85} speed={0.16} seed={17.0}
      />
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
      dpr={[1, 1.8]}
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
