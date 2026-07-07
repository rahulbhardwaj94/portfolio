"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Three.js hero: silver starfield + a rocket bobbing up and down with a
 * flickering engine flame and a flowing fuel/exhaust particle stream.
 *
 * - devicePixelRatio capped at 2
 * - render loop pauses when the hero is offscreen
 * - static single frame for prefers-reduced-motion
 */

const STAR_COUNT = 320;
const FUEL_COUNT = 140;

function Stars({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = -2 - Math.random() * 10;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.z += delta * 0.008;
    // gentle cursor parallax
    p.rotation.y += (mouse.current.x * 0.05 - p.rotation.y) * 0.04;
    p.rotation.x += (mouse.current.y * 0.03 - p.rotation.x) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

type PlumeProps = {
  /** Nozzle exit in the rocket group's local space */
  origin: [number, number, number];
  color: string;
  size?: number;
};

/** Exhaust plume: particles pour out of a nozzle, spreading as they fall. */
function ExhaustPlume({ origin, color, size = 0.06 }: PlumeProps) {
  const ref = useRef<THREE.Points>(null);
  const velocities = useMemo(
    () => Float32Array.from({ length: FUEL_COUNT }, () => 0.03 + Math.random() * 0.05),
    []
  );
  const positions = useMemo(() => {
    const arr = new Float32Array(FUEL_COUNT * 3);
    for (let i = 0; i < FUEL_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.12;
      arr[i * 3 + 1] = -Math.random() * 2.4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    return arr;
  }, []);

  useFrame(() => {
    const p = ref.current;
    if (!p) return;
    const pos = p.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < FUEL_COUNT; i++) {
      pos[i * 3 + 1] -= velocities[i];
      // billow outward as the plume falls
      pos[i * 3] *= 1.014;
      pos[i * 3 + 2] *= 1.014;
      if (pos[i * 3 + 1] < -2.6) {
        pos[i * 3] = (Math.random() - 0.5) * 0.1;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      }
    }
    p.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={origin}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/** Two-layer flame cone with a ref so the parent can flicker it. */
const Flame = React.forwardRef<
  THREE.Group,
  {
    position: [number, number, number];
    width: number;
    length: number;
    inner?: string;
    outer?: string;
  }
>(function Flame({ position, width, length, inner = "#fff3dc", outer = "#ff8a3c" }, ref) {
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, -length * 0.35, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[width * 0.55, length * 0.75, 20]} />
        <meshBasicMaterial
          color={inner}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -length * 0.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[width, length, 20]} />
        <meshBasicMaterial
          color={outer}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});

/**
 * Flying Iron-Man-style figure: red/gold armor, glowing arc reactor, and
 * blue-white repulsor jets from the palms and boots with particle trails.
 */
function IronMan({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const jetBootL = useRef<THREE.Group>(null);
  const jetBootR = useRef<THREE.Group>(null);
  const jetPalmL = useRef<THREE.Group>(null);
  const jetPalmR = useRef<THREE.Group>(null);
  const repulsorLight = useRef<THREE.PointLight>(null);

  const red = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: "#c62b26", metalness: 0.4, roughness: 0.35 }),
    []
  );
  const darkRed = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: "#8f1d18", metalness: 0.45, roughness: 0.4 }),
    []
  );
  const gold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: "#e9bb4f", metalness: 0.55, roughness: 0.3 }),
    []
  );
  const glow = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#bff4ff",
        emissive: "#7fe4ff",
        emissiveIntensity: 2.2,
        roughness: 0.2,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = group.current;
    if (!g) return;
    // hover: drift up and down with a slow banking sway
    g.position.y = Math.sin(t * 0.85) * 0.3;
    g.rotation.z = -0.1 + Math.sin(t * 0.5) * 0.05;
    // cursor parallax — figure turns slightly toward the pointer
    g.rotation.y += (-0.45 + mouse.current.x * 0.25 - g.rotation.y) * 0.05;

    // repulsor flicker
    const f = 1 + Math.sin(t * 26) * 0.12 + Math.sin(t * 10.3) * 0.07;
    jetBootL.current?.scale.set(1, f, 1);
    jetBootR.current?.scale.set(1, 0.92 + f * 0.18, 1);
    jetPalmL.current?.scale.set(1, 0.9 + f * 0.2, 1);
    jetPalmR.current?.scale.set(1, f, 1);
    if (repulsorLight.current) repulsorLight.current.intensity = 3 + f * 1.5;
  });

  return (
    <group ref={group} position={[3.1, 0.15, 0]} rotation={[0.08, -0.45, -0.1]} scale={1.05}>
      {/* helmet */}
      <group position={[0, 1.02, 0]}>
        <mesh material={red}>
          <sphereGeometry args={[0.17, 24, 24]} />
        </mesh>
        {/* gold faceplate */}
        <mesh position={[0, -0.01, 0.075]} scale={[0.78, 0.85, 0.62]} material={gold}>
          <sphereGeometry args={[0.16, 24, 24]} />
        </mesh>
        {/* eye slits */}
        {[-0.055, 0.055].map((x) => (
          <mesh key={x} position={[x, 0.015, 0.155]} material={glow}>
            <boxGeometry args={[0.05, 0.016, 0.02]} />
          </mesh>
        ))}
      </group>

      {/* torso */}
      <mesh position={[0, 0.52, 0]} material={red}>
        <cylinderGeometry args={[0.24, 0.16, 0.62, 20]} />
      </mesh>
      {/* chest plate */}
      <mesh position={[0, 0.6, 0.13]} scale={[1, 0.75, 0.5]} material={gold}>
        <sphereGeometry args={[0.16, 20, 20]} />
      </mesh>
      {/* arc reactor */}
      <mesh position={[0, 0.64, 0.21]} material={glow}>
        <sphereGeometry args={[0.05, 20, 20]} />
      </mesh>
      {/* abdomen + pelvis */}
      <mesh position={[0, 0.08, 0]} material={darkRed}>
        <cylinderGeometry args={[0.155, 0.17, 0.28, 20]} />
      </mesh>
      <mesh position={[0, -0.1, 0]} scale={[1, 0.7, 0.85]} material={red}>
        <sphereGeometry args={[0.18, 20, 20]} />
      </mesh>

      {/* arms — angled down and slightly out, palms firing */}
      {[-1, 1].map((side) => (
        <group
          key={`arm${side}`}
          position={[side * 0.27, 0.72, 0]}
          rotation={[0, 0, side * -0.32]}
        >
          <mesh material={red}>
            <sphereGeometry args={[0.11, 20, 20]} />
          </mesh>
          <mesh position={[0, -0.24, 0]} material={red}>
            <cylinderGeometry args={[0.075, 0.065, 0.34, 16]} />
          </mesh>
          <mesh position={[0, -0.44, 0]} material={gold}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh position={[0, -0.62, 0]} material={gold}>
            <cylinderGeometry args={[0.062, 0.055, 0.3, 16]} />
          </mesh>
          {/* hand + palm repulsor */}
          <mesh position={[0, -0.82, 0]} material={red}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>
          <mesh position={[0, -0.885, 0]} material={glow}>
            <sphereGeometry args={[0.035, 16, 16]} />
          </mesh>
          <Flame
            ref={side < 0 ? jetPalmL : jetPalmR}
            position={[0, -0.9, 0]}
            width={0.07}
            length={0.55}
            inner="#eefbff"
            outer="#5fd6ff"
          />
        </group>
      ))}

      {/* legs — together, slightly bent back */}
      {[-1, 1].map((side) => (
        <group key={`leg${side}`} position={[side * 0.12, -0.22, 0]} rotation={[0.08, 0, side * -0.05]}>
          <mesh position={[0, -0.24, 0]} material={red}>
            <cylinderGeometry args={[0.1, 0.085, 0.46, 16]} />
          </mesh>
          <mesh position={[0, -0.5, 0]} material={gold}>
            <sphereGeometry args={[0.085, 16, 16]} />
          </mesh>
          <mesh position={[0, -0.76, 0]} material={red}>
            <cylinderGeometry args={[0.08, 0.07, 0.44, 16]} />
          </mesh>
          {/* boot */}
          <mesh position={[0, -1.02, 0.03]} material={darkRed}>
            <boxGeometry args={[0.13, 0.14, 0.22]} />
          </mesh>
          {/* boot repulsor */}
          <mesh position={[0, -1.1, 0]} material={glow}>
            <cylinderGeometry args={[0.05, 0.06, 0.03, 16]} />
          </mesh>
          <Flame
            ref={side < 0 ? jetBootL : jetBootR}
            position={[0, -1.12, 0]}
            width={0.1}
            length={0.85}
            inner="#eefbff"
            outer="#5fd6ff"
          />
        </group>
      ))}

      {/* repulsor trails */}
      <ExhaustPlume origin={[-0.14, -1.35, 0]} color="#9fe9ff" size={0.045} />
      <ExhaustPlume origin={[0.14, -1.35, 0]} color="#9fe9ff" size={0.045} />

      <pointLight
        ref={repulsorLight}
        position={[0, -1.4, 0.5]}
        color="#7fd9ff"
        distance={6}
      />
    </group>
  );
}

export function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    if (wrapRef.current) io.observe(wrapRef.current);

    return () => {
      window.removeEventListener("mousemove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="absolute inset-0 -z-10"
      style={{
        maskImage:
          "linear-gradient(180deg, transparent 0%, #000 12%, #000 70%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, #000 12%, #000 70%, transparent 100%)",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        frameloop={reduced ? "demand" : active ? "always" : "never"}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[-4, 5, 6]} intensity={1.7} color="#ffffff" />
        <directionalLight position={[6, 1, 4]} intensity={0.6} color="#dfe9f2" />
        <Stars mouse={mouse} />
        <IronMan mouse={mouse} />
      </Canvas>
    </div>
  );
}
