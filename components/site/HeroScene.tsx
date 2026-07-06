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
  { position: [number, number, number]; width: number; length: number }
>(function Flame({ position, width, length }, ref) {
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, -length * 0.35, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[width * 0.55, length * 0.75, 20]} />
        <meshBasicMaterial
          color="#fff3dc"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -length * 0.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[width, length, 20]} />
        <meshBasicMaterial
          color="#ff8a3c"
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
 * Space-shuttle-style stack: orange external tank, two white solid rocket
 * boosters, and an orbiter with delta wings — riding white-orange exhaust.
 */
function Rocket({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const flameL = useRef<THREE.Group>(null);
  const flameR = useRef<THREE.Group>(null);
  const flameMain = useRef<THREE.Group>(null);
  const engineLight = useRef<THREE.PointLight>(null);

  const tankMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: "#b06a3c", metalness: 0.15, roughness: 0.65 }),
    []
  );
  const whiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: "#e6e8ea", metalness: 0.3, roughness: 0.45 }),
    []
  );
  const greyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: "#9ea3a8", metalness: 0.5, roughness: 0.5 }),
    []
  );
  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: "#2e3134", metalness: 0.85, roughness: 0.45 }),
    []
  );

  // Delta wing: thin extruded triangle
  const wingGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.55);
    shape.lineTo(0, -0.45);
    shape.lineTo(0.62, -0.45);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: false });
  }, []);

  // Tail fin: thin extruded triangle standing up
  const finGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, 0.5);
    shape.lineTo(0.3, 0);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: false });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = group.current;
    if (!g) return;
    // the up-and-down float
    g.position.y = Math.sin(t * 0.9) * 0.26;
    g.rotation.z = -0.08 + Math.sin(t * 0.55) * 0.03;
    // cursor parallax
    g.rotation.y += (mouse.current.x * 0.2 - g.rotation.y) * 0.05;

    // flame flicker
    const f = 1 + Math.sin(t * 24) * 0.12 + Math.sin(t * 9.7) * 0.07;
    flameL.current?.scale.set(1, f, 1);
    flameR.current?.scale.set(1, 0.9 + f * 0.2, 1);
    flameMain.current?.scale.set(1, 0.85 + f * 0.25, 1);
    if (engineLight.current) engineLight.current.intensity = 3.2 + f * 1.6;
  });

  return (
    <group ref={group} position={[3.1, 0.1, 0]} rotation={[0.06, 0, -0.08]} scale={0.98}>
      {/* external tank */}
      <mesh position={[0, 0.25, 0]} material={tankMat}>
        <cylinderGeometry args={[0.34, 0.34, 2.3, 32]} />
      </mesh>
      <mesh position={[0, 1.55, 0]} material={tankMat}>
        <coneGeometry args={[0.34, 0.6, 32]} />
      </mesh>
      <mesh position={[0, -0.95, 0]} material={tankMat}>
        <sphereGeometry args={[0.34, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      </mesh>

      {/* solid rocket boosters */}
      {[-0.56, 0.56].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.1, 0]} material={whiteMat}>
            <cylinderGeometry args={[0.15, 0.15, 2.1, 24]} />
          </mesh>
          <mesh position={[0, 1.32, 0]} material={greyMat}>
            <coneGeometry args={[0.15, 0.42, 24]} />
          </mesh>
          <mesh position={[0, -1.05, 0]} material={darkMat}>
            <cylinderGeometry args={[0.1, 0.15, 0.22, 24]} />
          </mesh>
        </group>
      ))}

      {/* orbiter riding the tank */}
      <group position={[0, -0.15, 0.52]}>
        <mesh position={[0, 0.25, 0]} material={whiteMat}>
          <cylinderGeometry args={[0.15, 0.17, 1.35, 24]} />
        </mesh>
        <mesh position={[0, 1.0, 0]} material={greyMat}>
          <sphereGeometry args={[0.15, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        {/* delta wings */}
        <mesh
          geometry={wingGeo}
          material={whiteMat}
          position={[0.02, -0.45, 0.1]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={wingGeo}
          material={whiteMat}
          position={[-0.02, -0.45, 0.1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[1, 1, -1]}
        />
        {/* tail fin */}
        <mesh
          geometry={finGeo}
          material={whiteMat}
          position={[-0.018, 0.72, 0.02]}
          rotation={[0.35, 0, 0]}
        />
        {/* main engines */}
        <mesh position={[0, -0.5, 0]} material={darkMat}>
          <cylinderGeometry args={[0.09, 0.13, 0.18, 20]} />
        </mesh>
      </group>

      {/* flames: boosters + orbiter main engines */}
      <Flame ref={flameL} position={[-0.56, -1.18, 0]} width={0.17} length={1.5} />
      <Flame ref={flameR} position={[0.56, -1.18, 0]} width={0.17} length={1.5} />
      <Flame ref={flameMain} position={[0, -0.78, 0.52]} width={0.12} length={1.0} />

      {/* billowing exhaust */}
      <ExhaustPlume origin={[-0.56, -1.15, 0]} color="#ffc9a0" />
      <ExhaustPlume origin={[0.56, -1.15, 0]} color="#ffc9a0" />
      <ExhaustPlume origin={[0, -0.75, 0.52]} color="#fff0dc" size={0.045} />

      <pointLight
        ref={engineLight}
        position={[0, -1.5, 0.6]}
        color="#ff9a4d"
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
        <ambientLight intensity={0.35} />
        <directionalLight position={[-4, 5, 6]} intensity={1.4} color="#ffffff" />
        <Stars mouse={mouse} />
        <Rocket mouse={mouse} />
      </Canvas>
    </div>
  );
}
