"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { mascot } from "@/data/mascot";

/**
 * Bix — a tiny flight recorder ("black box", painted international orange)
 * that perches on the hero trace panel. Eyes follow the cursor, it blinks
 * now and then, and hovering or tapping it prints a one-line quip.
 */
export function Mascot() {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const hop = useAnimationControls();
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [line, setLine] = useState<number | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const say = (i: number, ms = 2600) => {
    setLine(i);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setLine(null), ms);
  };

  // Eyes track the pointer, clamped to a small offset.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(d / 160, 1);
      setLook({ x: (dx / d) * 1.6 * k, y: (dy / d) * 1.4 * k });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  // Irregular blinking, plus a one-time hello shortly after load.
  useEffect(() => {
    if (reduced) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        loop();
      }, 2400 + Math.random() * 3200);
    };
    loop();
    const hello = setTimeout(() => say(0, 3200), 2200);
    return () => {
      clearTimeout(t);
      clearTimeout(hello);
      clearTimeout(hideTimer.current);
    };
  }, [reduced]);

  const next = () => say(line === null ? 1 : (line % (mascot.lines.length - 1)) + 1);

  const onClick = () => {
    next();
    if (!reduced) hop.start({ y: [0, -9, 0], transition: { duration: 0.42, ease: "easeOut" } });
  };

  return (
    <div className="relative">
      {/* speech bubble */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute bottom-[calc(100%+6px)] right-0 whitespace-nowrap rounded-[6px] border border-fg-faint bg-surface px-2.5 py-1.5 font-data text-[11px] text-fg-body shadow-[0_6px_20px_-12px_rgba(0,0,0,0.35)] transition-[opacity,transform] duration-200 ${
          line === null ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {line !== null && mascot.lines[line]}
        <span className="absolute -bottom-[5px] right-4 h-2 w-2 rotate-45 border-b border-r border-fg-faint bg-surface" />
      </div>

      <motion.button
        ref={ref}
        type="button"
        animate={hop}
        onClick={onClick}
        onMouseEnter={() => line === null && next()}
        aria-label={`${mascot.name}, the site's flight recorder. Click for a status line.`}
        className="block cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
      >
        <BixSvg look={look} blink={blink} />
      </motion.button>
    </div>
  );
}

export function BixSvg({
  look = { x: 0, y: 0 },
  blink = false,
  size = 40,
}: {
  look?: { x: number; y: number };
  blink?: boolean;
  size?: number;
}) {
  const eyeScale = blink ? 0.1 : 1;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 40 44" aria-hidden className="overflow-visible">
      {/* carry handle */}
      <path d="M13 9 V5.5 Q13 3 15.5 3 H24.5 Q27 3 27 5.5 V9" fill="none" strokeWidth="2.2" className="stroke-fg-hi" />
      {/* body */}
      <rect x="4" y="8" width="32" height="30" rx="6" className="fill-signal" />
      {/* recording light */}
      <circle cx="31.5" cy="12.5" r="1.5" className="span-live fill-night" />
      {/* reflective tape stripe */}
      <rect x="4" y="30" width="32" height="3.2" className="fill-night/85" />
      {/* eyes */}
      {[14.5, 25.5].map((cx) => (
        <g key={cx} style={{ transform: `scaleY(${eyeScale})`, transformOrigin: `${cx}px 19.5px`, transition: "transform 70ms" }}>
          <ellipse cx={cx} cy="19.5" rx="3.6" ry="4.2" className="fill-night" />
          <circle cx={cx + look.x} cy={19.8 + look.y} r="1.9" className="fill-fg-hi" />
        </g>
      ))}
      {/* feet */}
      <rect x="10" y="38" width="5" height="3.5" rx="1" className="fill-fg-hi" />
      <rect x="25" y="38" width="5" height="3.5" rx="1" className="fill-fg-hi" />
    </svg>
  );
}
