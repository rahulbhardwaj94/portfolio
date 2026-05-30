"use client";

import { useEffect, useRef } from "react";
import { useGamification } from "@/components/gamification/GamificationContext";

export function DeepDiverTracker() {
  const { unlock } = useGamification();
  const fired = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (fired.current) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 100 : (window.scrollY / max) * 100;
      if (pct >= 90) {
        fired.current = true;
        unlock("deep_diver");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [unlock]);

  return null;
}
