"use client";

import { useEffect, useRef } from "react";

const HEX = "0123456789abcdef".split("");

// Developer-flavored tokens that float upward
const TOKENS = [
  "0xDEAD", "NaN", "undefined", "null", "async",
  "0x1A4F", "0xFF00", "404", "ERR_CONN", "0xBEEF",
  "SIGTERM", "kubectl", "docker run", "void 0",
  "Infinity", "0xCAFE", "503", "timeout", "retry(3)",
  "0x7FFF", "git push", "SELECT *", "DROP TABLE",
  "2e10", "0x00FF", "catch(e)", "=> {}", "...rest",
];

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FS = 14;
    // Each column: { y position, speed multiplier }
    type Col = { y: number; speed: number };
    let cols: Col[] = [];
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const n = Math.floor(canvas.width / FS);
      cols = Array.from({ length: n }, (_, i) => ({
        y: Math.floor(Math.random() * -(canvas.height / FS) * ((i % 5) / 5 + 0.4)),
        speed: 0.28 + (i % 7) * 0.04,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      // Slow fade creates the trailing tail effect
      ctx.fillStyle = "rgba(10,10,10,0.052)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const sudo = document.documentElement.classList.contains("sudo");
      const bright  = sudo ? "rgba(0,255,65,1)"    : "rgba(20,184,166,1)";
      const mid     = sudo ? "rgba(0,255,65,0.45)" : "rgba(20,184,166,0.42)";
      const dim     = sudo ? "rgba(0,200,50,0.16)" : "rgba(14,155,143,0.16)";

      ctx.font = `${FS}px 'Geist Mono',ui-monospace,monospace`;

      cols.forEach((col, i) => {
        const x  = i * FS;
        const py = col.y * FS;

        // Bright head
        ctx.fillStyle = bright;
        ctx.fillText(HEX[Math.floor(Math.random() * HEX.length)], x, py);

        // Mid trail (1 behind)
        if (col.y > 0) {
          ctx.fillStyle = mid;
          ctx.fillText(HEX[Math.floor(Math.random() * HEX.length)], x, py - FS);
        }

        // Dim trail (2 behind)
        if (col.y > 1) {
          ctx.fillStyle = dim;
          ctx.fillText(HEX[Math.floor(Math.random() * HEX.length)], x, py - FS * 2);
        }

        // Reset column once it leaves the bottom, with random stagger
        if (py > canvas.height + FS * 6 && Math.random() > 0.972) {
          col.y = Math.floor(Math.random() * -8);
        }
        col.y += col.speed;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Dot grid — fixed so it doesn't scroll */}
      <div className="ambient-dot-grid" aria-hidden />

      {/* Matrix rain canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.2,
        }}
      />

      {/* Floating code tokens */}
      <div className="ambient-tokens" aria-hidden>
        {TOKENS.map((t, i) => (
          <span
            key={t}
            className="ambient-token"
            style={{
              left: `${(i * 4.3 + 2) % 95}%`,
              animationDuration: `${24 + (i * 7) % 26}s`,
              animationDelay: `${-((i * 9) % 24)}s`,
              fontSize: `${10 + (i % 3)}px`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </>
  );
}
