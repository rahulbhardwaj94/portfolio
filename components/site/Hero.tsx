"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { TraceWaterfall } from "./TraceWaterfall";

// Lazy-load the three.js span field so it never blocks first paint.
// Desktop only — on phones it would sit behind the text, so mobile stays clean.
const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export function Hero() {
  const { heroHeadline } = profile;
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setShowScene(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative z-[5] mx-auto flex min-h-screen w-full max-w-[1240px] flex-col justify-center px-5 pb-16 pt-[112px] md:px-16 md:pb-20 md:pt-[128px]">
      {showScene && <HeroScene />}

      <div className="mb-7 rise" style={{ animationDelay: "0ms" }}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-data text-[11px] text-fg-dim">
          <span className="flex items-center gap-2 text-signal">
            <span className="span-live h-1.5 w-1.5 rounded-full bg-signal" />
            {profile.availability}
          </span>
          <span className="hidden text-fg-dim sm:inline">/</span>
          <span className="hidden sm:inline">{profile.location}</span>
        </div>
      </div>

      <div className="rise" style={{ animationDelay: "50ms" }}>
        <h1 className="max-w-[1000px] font-display text-[50px] font-normal leading-[0.98] tracking-[-0.5px] text-fg-hi sm:text-[64px] md:text-[84px]">
          {heroHeadline.line1}{" "}
          {heroHeadline.line2Accent}
        </h1>
      </div>

      <div className="rise" style={{ animationDelay: "120ms" }}>
        <div className="mt-7 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[560px] text-[17px] font-light leading-[1.65] text-fg-soft">
            <span className="text-fg-hi">{profile.name}</span> — {profile.heroSub}
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href="#incidents" className="btn-signal">
              Read the postmortems <span aria-hidden>→</span>
            </a>
            <a href={profile.links.resume} className="btn-ghost">
              Résumé
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-14 rise" style={{ animationDelay: "200ms" }}>
        <TraceWaterfall />
      </div>
    </section>
  );
}
