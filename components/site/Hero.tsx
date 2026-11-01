"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";
import { TraceWaterfall } from "./TraceWaterfall";

// Lazy-load both hero backdrops so they never block first paint.
// Desktop gets the three.js span field; mobile keeps the lightweight 2D canvas.
const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

export function Hero() {
  const { heroHeadline } = profile;
  const [backdrop, setBackdrop] = useState<"none" | "2d" | "3d">("none");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setBackdrop(mq.matches ? "3d" : "2d");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative z-[5] mx-auto flex min-h-screen w-full max-w-[1240px] flex-col justify-center px-5 pb-16 pt-[112px] md:px-16 md:pb-20 md:pt-[128px]">
      {backdrop === "3d" && <HeroScene />}
      {backdrop === "2d" && <HeroCanvas />}

      <Reveal className="mb-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-trace text-[11px] uppercase tracking-[2px] text-paper-dim">
          <span className="flex items-center gap-2 text-phosphor">
            <span className="span-live h-1.5 w-1.5 rounded-full bg-phosphor" />
            {profile.availability}
          </span>
          <span className="hidden text-paper-faint sm:inline">/</span>
          <span className="hidden sm:inline">{profile.location}</span>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="max-w-[1000px] font-serif text-[50px] font-normal leading-[0.98] tracking-[-0.5px] text-paper-hi sm:text-[64px] md:text-[96px] md:tracking-[-1.5px]">
          {heroHeadline.line1}{" "}
          <em className="phosphor-glow text-phosphor">{heroHeadline.line2Accent}</em>
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="mt-7 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[560px] text-[17px] font-light leading-[1.65] text-paper-soft">
            <span className="text-paper-hi">{profile.name}</span> — {profile.heroSub}
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href="#incidents" className="btn-phosphor">
              Read the postmortems <span aria-hidden>→</span>
            </a>
            <a href={profile.links.resume} className="btn-ghost">
              Résumé
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mt-12 md:mt-14">
        <TraceWaterfall />
      </Reveal>
    </section>
  );
}
