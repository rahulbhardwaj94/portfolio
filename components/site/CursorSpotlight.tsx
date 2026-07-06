"use client";

import { useEffect, useRef } from "react";

/** Soft radial glow that follows the cursor. Skipped on touch devices and reduced motion. */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverable = window.matchMedia("(hover: hover)").matches;
    if (reduced || !hoverable) return;

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2] -ml-[340px] -mt-[340px] h-[680px] w-[680px] rounded-full mix-blend-screen"
      style={{
        transform: "translate(-9999px, -9999px)",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.075), rgba(255,255,255,0.028) 45%, transparent 70%)",
      }}
    />
  );
}
