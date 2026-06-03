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
  uniform float uTwist;
  uniform float uFold;
  uniform float uBaseZ;

  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vView;

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

  // long, non-repetitive flowing centre-line (layered low-freq noise, no plain sine)
  float flow(float x, float t){
    float a = snoise(vec3(x * 0.052 - t * 0.030, uSeed,        0.0)) * 1.70;
    float b = snoise(vec3(x * 0.110 + t * 0.050, uSeed + 3.0,  0.0)) * 0.85;
    float c = snoise(vec3(x * 0.205 + t * 0.070, uSeed + 7.0,  0.0)) * 0.30;
    return (a + b + c) * uAmp;
  }

  // slow twist of the ribbon about its long axis -> real fabric folds
  float twistAngle(float x, float t){
    return snoise(vec3(x * 0.085 + t * 0.045, uSeed + 11.0, 0.0)) * uTwist;
  }

  // depth undulation
  float foldZ(float x, float t){
    return snoise(vec3(x * 0.070 + t * 0.038, uSeed + 5.0, 0.0)) * uFold;
  }

  // full 3D position of a point at length x, width-coord w
  vec3 displace(float x, float w, float t){
    float cy  = flow(x, t);
    float ang = twistAngle(x, t);
    float ly  = w * cos(ang);
    float lz  = w * sin(ang);
    float z   = uBaseZ + foldZ(x, t) + lz;
    return vec3(x, cy + ly, z);
  }

  void main(){
    vUv = uv;
    float t = uTime * uSpeed;

    float x = position.x;
    float w = position.y;
    float e = 0.05;

    vec3 P  = displace(x, w, t);
    vec3 Px = displace(x + e, w, t);
    vec3 Pw = displace(x, w + e, t);
    vec3 N  = normalize(cross(Px - P, Pw - P));

    // gentle, slow mouse parallax (whole sheet drifts)
    P.y += uMouse.y * 0.22;
    P.x += uMouse.x * 0.14;

    vec4 mv = modelViewMatrix * vec4(P, 1.0);
    vView   = normalize(-mv.xyz);
    vNormal = normalize(normalMatrix * N);

    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3  uColor;
  uniform vec3  uSheen;
  uniform float uOpacity;
  uniform float uTime;

  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vView;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    // silk is two-sided: orient the normal toward the camera
    if (dot(N, V) < 0.0) N = -N;

    // key light high-right, soft fill
    vec3 L = normalize(vec3(0.35, 0.62, 0.70));
    float diff = max(dot(N, L), 0.0);

    // crisp specular silk highlight
    vec3  H    = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 30.0);

    // folds turned away from the light read as soft self-shadow
    float shade = 0.50 + 0.60 * diff;
    vec3  col   = uColor * shade;
    col += uSheen * spec * 0.65;

    // grazing-angle satin sheen at the silhouette of each fold
    float graze = pow(1.0 - max(dot(N, V), 0.0), 2.6);
    col += uSheen * graze * 0.14;

    // premium fine grain (fabric weave), animated subtly
    float grain = (hash(vUv * vec2(900.0, 520.0) + floor(uTime * 14.0)) - 0.5) * 0.030;
    col += grain;

    // SHARP edges across the width; only the very ends fade off-frame
    float edge = smoothstep(0.0, 0.030, vUv.y) * smoothstep(1.0, 0.970, vUv.y);
    float ends = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);

    float alpha = uOpacity * edge * ends;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

function Ribbon({ cfg, mouse }) {
  const matRef = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAmp: { value: cfg.amp },
      uSpeed: { value: cfg.speed },
      uSeed: { value: cfg.seed },
      uTwist: { value: cfg.twist },
      uFold: { value: cfg.fold },
      uBaseZ: { value: cfg.baseZ },
      uColor: { value: new THREE.Color(cfg.color) },
      uSheen: { value: new THREE.Color(cfg.sheen) },
      uOpacity: { value: cfg.opacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    const u = matRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMouse.value.lerp(mouse.current, 0.025);
  });

  return (
    <mesh position={[0, cfg.y, 0]} renderOrder={cfg.order}>
      <planeGeometry args={[40, cfg.width, 300, 24]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// three distinct depth layers — colours kept separate (no muddy blend)
const RIBBONS = [
  // BACKGROUND — soft blue, deepest, broadest & slowest
  { color: '#3F73E6', sheen: '#CFE0FF', baseZ: -3.2, y: 0.55,  width: 3.6, amp: 1.75, twist: 1.45, fold: 0.85, speed: 0.045, opacity: 0.60, seed: 12.0, order: 0 },
  // MIDDLE — warm gold
  { color: '#E0A53A', sheen: '#FFF0C6', baseZ: -1.1, y: -0.35, width: 3.1, amp: 1.45, twist: 1.65, fold: 0.70, speed: 0.058, opacity: 0.74, seed: 5.0,  order: 1 },
  // FOREGROUND — off-white, crispest & most opaque
  { color: '#F2EEE4', sheen: '#FFFFFF', baseZ: 1.1,  y: 0.10,  width: 2.7, amp: 1.20, twist: 1.85, fold: 0.60, speed: 0.070, opacity: 0.88, seed: 21.0, order: 2 },
];

function Scene({ mouse }) {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      // very slow, luxury drift — no shake, no obvious loop
      group.current.position.y = Math.sin(t * 0.13) * 0.10;
      group.current.rotation.z = -0.07 + Math.sin(t * 0.08) * 0.015;
    }
  });

  return (
    <group ref={group} rotation={[-0.06, 0, -0.07]}>
      {RIBBONS.map((cfg) => (
        <Ribbon key={cfg.seed} cfg={cfg} mouse={mouse} />
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
      camera={{ position: [0, 0, 9], fov: 34 }}
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
