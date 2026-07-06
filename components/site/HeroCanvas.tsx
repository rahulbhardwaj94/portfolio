"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; z: number; r: number };

/**
 * Calm node constellation on a 2D canvas: sparse glowing nodes joined by thin
 * light-lines, drifting slowly with gentle cursor parallax.
 *
 * - devicePixelRatio capped at 2
 * - render loop pauses when the hero is offscreen
 * - static single frame on mobile and for prefers-reduced-motion
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    const animated = !reduced && !mobile;

    let W = 0;
    let H = 0;
    let raf = 0;
    let visible = true;
    const mouse = { x: 0.5, y: 0.5 };
    let parx = 0;
    let pary = 0;

    const count = mobile ? 16 : 40;
    const maxD = mobile ? 130 : 165;
    const nodes: Node[] = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 0.11,
      vy: (Math.random() - 0.5) * 0.11,
      z: Math.random() * 0.6 + 0.4,
      r: Math.random() * 1.4 + 1,
    }));

    const scatter = () => {
      for (const n of nodes) {
        n.x = Math.random() * W;
        n.y = Math.random() * H;
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const prevW = W;
      const prevH = H;
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Keep nodes spread across the new size instead of stranding them.
      if (prevW > 0 && prevH > 0) {
        for (const n of nodes) {
          n.x = (n.x / prevW) * W;
          n.y = (n.y / prevH) * H;
        }
      } else {
        scatter();
      }
    };
    resize();

    const drawFrame = () => {
      ctx.clearRect(0, 0, W, H);
      const tx = (mouse.x - 0.5) * 34;
      const ty = (mouse.y - 0.5) * 34;
      parx += (tx - parx) * 0.045;
      pary += (ty - pary) * 0.045;

      if (animated) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0) n.x += W;
          if (n.x > W) n.x -= W;
          if (n.y < 0) n.y += H;
          if (n.y > H) n.y -= H;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxD) {
            ctx.beginPath();
            ctx.moveTo(a.x + parx * a.z, a.y + pary * a.z);
            ctx.lineTo(b.x + parx * b.z, b.y + pary * b.z);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / maxD) * 0.09})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const x = n.x + parx * n.z;
        const y = n.y + pary * n.z;
        // Soft white glow scaled by depth so far stars sit dimmer — reads
        // like a real night sky rather than neon points.
        const rg = n.r * 5;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rg);
        g.addColorStop(0, `rgba(255,255,255,${0.5 * n.z})`);
        g.addColorStop(0.4, `rgba(255,255,255,${0.1 * n.z})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rg, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.45 + 0.5 * n.z})`;
        ctx.beginPath();
        ctx.arc(x, y, n.r * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (animated && visible) raf = requestAnimationFrame(drawFrame);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    if (animated) window.addEventListener("mousemove", onMove, { passive: true });

    const onResize = () => {
      resize();
      if (!animated) drawFrame();
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (animated && visible && !wasVisible) raf = requestAnimationFrame(drawFrame);
      if (!visible) cancelAnimationFrame(raf);
    });
    io.observe(canvas);

    drawFrame();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (animated) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 -z-10 h-full w-full"
      style={{
        maskImage:
          "linear-gradient(180deg, transparent 0%, #000 14%, #000 66%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, #000 14%, #000 66%, transparent 100%)",
      }}
    />
  );
}
