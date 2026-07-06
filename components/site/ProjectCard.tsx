"use client";

import { useRef } from "react";
import type { Project } from "@/data/projects";
import { featuredHighlights } from "@/data/projects";

/**
 * Glassmorphic project card with cursor tilt + contained sheen.
 * Glow ramps slowly on enter (~0.6s) and fades fast on leave (~0.15s).
 */
export function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const interactive = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onEnter = () => {
    const s = sheenRef.current;
    if (!s || !interactive()) return;
    s.style.transition = "opacity .6s ease";
    s.style.opacity = "1";
  };

  const onMove = (e: React.MouseEvent) => {
    const c = cardRef.current;
    const s = sheenRef.current;
    if (!c || !s || !interactive()) return;
    const r = c.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 5;
    const ry = (px - 0.5) * 5;
    c.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    s.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.09), rgba(255,255,255,0.03) 45%, transparent 70%)`;
  };

  const onLeave = () => {
    const c = cardRef.current;
    const s = sheenRef.current;
    if (c) c.style.transform = "";
    if (s) {
      s.style.transition = "opacity .15s ease-out";
      s.style.opacity = "0";
    }
  };

  const featured = project.featured;

  return (
    <article
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`glass-card flex h-full flex-col transition-transform duration-500 [transform-style:preserve-3d] ${
        featured ? "p-[34px]" : "p-[26px]"
      }`}
    >
      <div
        ref={sheenRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
      />
      {featured && (
        <div className="card-hairline absolute left-[26px] right-[26px] top-0 h-px" />
      )}

      <div className="flex items-center justify-between">
        <span
          className={`font-plexmono uppercase ${
            featured
              ? "flex items-center gap-2 text-[11px] tracking-[2px] text-cyan"
              : "text-[10.5px] tracking-[1.6px] text-[#64686e]"
          }`}
        >
          {featured && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-cyan"
              style={{ boxShadow: "0 0 10px #00d4ff" }}
            />
          )}
          {project.eyebrow}
        </span>
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} on GitHub`}
            className={
              featured
                ? "flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-white/10 bg-white/[0.02] text-sm text-[#c6c9cc] transition-colors hover:border-white/25"
                : "text-[13px] text-[#c6c9cc] transition-colors hover:text-ink-hi"
            }
          >
            ↗
          </a>
        )}
      </div>

      <h3
        className={`font-grotesk font-semibold text-ink-hi ${
          featured
            ? "mt-[26px] text-[34px] tracking-[-1px]"
            : "mt-4 text-[21px] tracking-[-0.5px]"
        }`}
      >
        {project.name}
      </h3>
      <p
        className={`font-light text-[#9fa3a8] ${
          featured
            ? "mt-3.5 max-w-[520px] text-[16.5px] leading-[1.6]"
            : "mt-[9px] text-[13.5px] leading-[1.55]"
        }`}
      >
        {project.blurb}
      </p>

      {featured && (
        <div className="mt-[26px] flex flex-wrap gap-[26px]">
          {featuredHighlights.map((h, i) => (
            <div key={h.label} className="flex gap-[26px]">
              {i > 0 && <div className="w-px bg-white/[0.08]" />}
              <div>
                <div className="font-grotesk text-3xl font-semibold tracking-[-0.5px] text-[#eaf6ff]">
                  {h.value}
                </div>
                <div className="mt-[3px] text-xs tracking-[0.4px] text-ink-dim">
                  {h.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {project.metric && (
        <div className="mt-4 font-grotesk text-[22px] font-semibold text-[#eaf6ff]">
          {project.metric.value}{" "}
          <span className="text-xs font-normal text-ink-dim">
            {project.metric.label}
          </span>
        </div>
      )}

      {project.detail && (
        <div className="mt-4 font-plexmono text-xs text-cyan">{project.detail}</div>
      )}

      <div
        className={`mt-auto flex flex-wrap ${
          featured ? "gap-[9px] pt-7" : "gap-[7px] pt-[18px]"
        }`}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={featured ? "tag-pill bg-white/[0.02] !text-xs !px-3 !py-1.5 !text-[#b3b7bb]" : "tag-pill"}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
