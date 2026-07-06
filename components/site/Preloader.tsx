"use client";

import { useEffect, useState } from "react";

/** Short elegant preloader that fades out once the page has mounted. */
export function Preloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-night transition-[opacity,visibility] duration-[600ms] ease-out ${
        loaded ? "invisible opacity-0" : "visible opacity-100"
      }`}
    >
      <div className="h-[34px] w-[34px] animate-spin rounded-full border-[1.5px] border-white/10 border-t-cyan" />
      <div className="mt-[18px] font-plexmono text-[11px] uppercase tracking-[3px] text-[#606468]">
        initializing
      </div>
    </div>
  );
}
