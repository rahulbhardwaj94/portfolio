"use client";

import React from "react";
import { GamificationProvider } from "@/components/gamification/GamificationContext";
import { GamificationUI } from "@/components/gamification/GamificationUI";
import { HeroCard } from "@/components/bento/HeroCard";
import { MetricsCard } from "@/components/bento/MetricsCard";
import { NpmCard } from "@/components/bento/NpmCard";
import { NowBuildingCard } from "@/components/bento/NowBuildingCard";
import { WritingCard } from "@/components/bento/WritingCard";
import { StackCard } from "@/components/bento/StackCard";
import { CaseStudiesCard } from "@/components/bento/CaseStudiesCard";
import { ContactCard } from "@/components/bento/ContactCard";
import { DangerCard } from "@/components/bento/DangerCard";
import { SudoArchiveCard } from "@/components/bento/SudoArchiveCard";
import { useGamification } from "@/components/gamification/GamificationContext";
import { AmbientBackground } from "@/components/AmbientBackground";

function BentoGrid() {
  const { sudo, onTapLogo } = useGamification();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand" onClick={onTapLogo} title="tap 5× for a surprise">
          <div className="brand-mark">R</div>
          <div className="brand-name">rahul.bhardwaj</div>
          <div className="brand-sub mono">/ portfolio</div>
        </div>
        <div className="topbar-right">
          <span className="pill mono">
            <span className="dot" />
            system: nominal
          </span>
          <span className="pill mono">delhi · ist</span>
        </div>
      </header>

      <main className="bento">
        <HeroCard />
        <MetricsCard />
        <NpmCard />
        <NowBuildingCard />
        <WritingCard />
        <StackCard />
        <CaseStudiesCard />
        <ContactCard />
        <DangerCard />
        {sudo && <SudoArchiveCard />}
      </main>

      <footer className="footer">
        <span>© 2026 · rahul.bhardwaj · built in delhi</span>
        <span suppressHydrationWarning>
            last deploy · {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC
          </span>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <GamificationProvider>
      <AmbientBackground />
      <BentoGrid />
      <GamificationUI />
    </GamificationProvider>
  );
}
