"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

export function WorkSection() {
  const [open, setOpen] = useState<string | null>(
    projects.find((p) => p.featured)?.slug ?? null
  );

  return (
    <section
      id="work"
      className="relative z-[5] mx-auto max-w-[1240px] scroll-mt-20 px-5 py-[90px] md:px-16 md:py-[120px]"
    >
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="home-eyebrow mb-4">01 — Spans</div>
            <h2 className="font-serif text-[44px] leading-[1] text-paper-hi md:text-[64px]">
              Infrastructure for <em className="text-phosphor">agents</em>.
            </h2>
          </div>
          <p className="m-0 max-w-[360px] text-[15px] font-light leading-[1.6] text-paper-soft">
            Open-source orchestration, evaluation, memory, and governance. Expand a span to
            read its attributes.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="panel overflow-hidden">
          <div className="hidden grid-cols-[18px_200px_1fr_auto] gap-6 border-b border-paper-faint/50 px-5 py-2.5 font-trace text-[10px] uppercase tracking-[1.5px] text-paper-faint md:grid">
            <span />
            <span>service</span>
            <span>kind</span>
            <span>status</span>
          </div>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              open={open === project.slug}
              onToggle={() => setOpen(open === project.slug ? null : project.slug)}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
