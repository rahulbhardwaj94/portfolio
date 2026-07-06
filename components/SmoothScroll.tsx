"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Lenis drives its own rAF — safer than a hand-rolled loop across
      // React StrictMode/HMR remounts.
      autoRaf: true,
      // Route same-page #anchor clicks through Lenis; a native hash jump
      // fights the smooth-scroll loop and strands the viewport mid-scroll.
      anchors: { offset: -70 },
    });

    // Handy for debugging scroll issues from the console.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
