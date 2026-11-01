"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Three.js hero backdrop: a deep field of thin horizontal "spans" drifting
 * left-to-right at different depths — telemetry streaming past, in warm
 * fg-white with a few amber outliers. Deliberately quiet so the trace
 * waterfall and headline stay the focus.
 *
 * - devicePixelRatio capped at 2
 * - render loop pauses when the hero is offscreen
 * - static single frame for prefers-reduced-motion
 */

const SPAN_COUNT = 140;
const FIELD_W = 30;

/** Reads a "--t-*" channel triplet ("r g b") from the active theme as a CSS colour. */
function themeColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.querySelector("[data-theme]") ?? document.documentElement).getPropertyValue(name).trim();
  return v ? `rgb(${v.split(/\s+/).join(",")})` : fallback;
}

type SpanSeed = { x: number; y: number; z: number; len: number; speed: number; amber: boolean };

function SpanField({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo<SpanSeed[]>(
    () =>
      Array.from({ length: SPAN_COUNT }, () => {
        const z = -1 - Math.random() * 14;
        return {
          x: (Math.random() - 0.5) * FIELD_W,
          // spans sit in loose "lanes" like rows of a trace
          y: Math.round((Math.random() - 0.5) * 26) * 0.42,
          z,
          len: 0.3 + Math.random() ** 2 * 3.2,
          speed: 0.12 + Math.random() * 0.35,
          amber: Math.random() < 0.12,
        };
      }),
    []
  );

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const paper = new THREE.Color(themeColor("--t-fg-hi", "#e9e0cc"));
    const amber = new THREE.Color(themeColor("--t-signal", "#ffb547"));
    seeds.forEach((s, i) => m.setColorAt(i, s.amber ? amber : paper));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [seeds]);

  useFrame((_, delta) => {
    const m = mesh.current;
    const g = group.current;
    if (!m || !g) return;
    const dt = Math.min(delta, 0.05);
    seeds.forEach((s, i) => {
      s.x += s.speed * dt;
      if (s.x - s.len / 2 > FIELD_W / 2) s.x = -FIELD_W / 2 - s.len / 2;
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(s.len, 1, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    // gentle cursor parallax
    g.rotation.y += (mouse.current.x * 0.06 - g.rotation.y) * 0.04;
    g.rotation.x += (mouse.current.y * 0.04 - g.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, SPAN_COUNT]}>
        <boxGeometry args={[1, 0.045, 0.02]} />
        <meshBasicMaterial transparent opacity={0.3} depthWrite={false} toneMapped={false} />
      </instancedMesh>
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
          "radial-gradient(ellipse 38% 32% at 88% 18%, #000 10%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 38% 32% at 88% 18%, #000 10%, transparent 100%)",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        frameloop={reduced ? "demand" : active ? "always" : "never"}
      >
        <fog attach="fog" args={[themeColor("--t-bg", "#0b0a08"), 6, 22]} />
        <SpanField mouse={mouse} />
      </Canvas>
    </div>
  );
}
