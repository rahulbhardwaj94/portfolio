"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";

// Lazy-load both hero backdrops so they never block first paint.
// Desktop gets the three.js scene; mobile keeps the lightweight 2D canvas.
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
    setBackdrop(window.innerWidth < 768 ? "2d" : "3d");
  }, []);

  return (
    <section className="relative z-[5] mx-auto flex min-h-screen w-full max-w-[1240px] flex-col justify-center px-6 pb-20 pt-[120px] md:px-16 md:py-0">
      {backdrop === "3d" && <HeroScene />}
      {backdrop === "2d" && <HeroCanvas />}

      <Reveal className="mb-[30px] w-fit">
        <div className="flex items-center gap-[9px] rounded-full border border-white/10 bg-white/[0.02] px-[13px] py-1.5 backdrop-blur-lg">
          <span
            className="h-1.5 w-1.5 rounded-full bg-cyan"
            style={{ boxShadow: "0 0 10px #00d4ff" }}
          />
          <span className="font-plexmono text-[11.5px] uppercase tracking-[1.5px] text-[#a4a9ad]">
            {profile.availability}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="max-w-[900px] font-grotesk text-[52px] font-semibold leading-[1.02] tracking-[-1px] text-ink-hi md:text-[82px] md:tracking-[-2.4px]">
          {heroHeadline.line1}
          <br />
          <span className="text-[#b3b7bb]">{heroHeadline.line2}</span>{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #eaf6ff, #00d4ff 55%, #7fd9ff)",
            }}
          >
            {heroHeadline.line2Accent}
          </span>
          .
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-7 max-w-[560px] text-lg font-light leading-[1.6] text-ink-soft">
          {profile.heroSub}
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <div className="mt-10 flex flex-wrap gap-3.5">
          <a
            href="#work"
            className="inline-flex items-center gap-[9px] rounded-xl px-[26px] py-3.5 text-[15px] font-medium text-[#04252e]"
            style={{
              background: "linear-gradient(180deg, #38dbff, #00c2f0)",
              boxShadow:
                "0 0 0 1px rgba(0,212,255,0.4), 0 10px 40px -12px rgba(0,212,255,0.6)",
            }}
          >
            View Work <span className="text-base">→</span>
          </a>
          <a
            href={profile.links.resume}
            className="inline-flex items-center gap-[9px] rounded-xl border border-white/[0.14] bg-white/[0.02] px-[26px] py-3.5 text-[15px] font-medium text-[#dee0e2] backdrop-blur-lg transition-colors hover:border-white/25"
          >
            Résumé
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.3} className="absolute bottom-11 left-6 hidden md:left-16 md:block">
        <div className="flex items-center gap-3 font-plexmono text-[11px] uppercase tracking-[2px] text-ink-faint">
          <span className="inline-block h-px w-[26px] bg-[#3d4043]" /> scroll
        </div>
      </Reveal>
    </section>
  );
}
