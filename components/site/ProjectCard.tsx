"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { featuredHighlights } from "@/data/projects";

/**
 * A project rendered as an expandable span in a trace viewer: the collapsed
 * row shows service, op and status; expanding reveals its attributes.
 */
export function ProjectCard({
  project,
  index,
  open,
  onToggle,
}: {
  project: Project;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const spanId = (0x3a7f + index * 0x1b3).toString(16).padStart(4, "0");

  return (
    <article
      className={`border-b border-fg-faint/40 transition-colors ${
        open ? "bg-white/[0.02]" : "hover:bg-white/[0.012]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full grid-cols-[18px_1fr_auto] items-center gap-3 px-3 py-5 text-left md:grid-cols-[18px_200px_1fr_auto] md:gap-6 md:px-5"
      >
        <span
          className={`font-data text-[12px] text-fg-dim transition-transform duration-300 ${
            open ? "rotate-90 text-signal" : ""
          }`}
        >
          ▸
        </span>
        <span className="flex items-baseline gap-3">
          <span className={`font-display text-[26px] leading-none md:text-[30px] ${open ? "text-signal" : "text-fg-hi"}`}>
            {project.name}
          </span>
        </span>
        <span className="hidden truncate font-data text-[11.5px] text-fg-dim md:block">
          {project.eyebrow}
        </span>
        <span className="flex items-center gap-2 font-data text-[11px] text-fg-dim">
          <span className="hidden sm:inline">span {spanId}</span>
          <span className="rounded-[3px] border border-ok/40 px-1.5 py-[1px] text-ok">OK</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="attrs"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 px-3 pb-7 md:grid-cols-[218px_1fr] md:gap-6 md:px-5">
              <div className="hidden md:block" />
              <div>
                <p className="max-w-[640px] text-[16px] font-light leading-[1.65] text-fg-body">
                  {project.blurb}
                </p>

                {project.featured && (
                  <div className="mt-6 flex flex-wrap gap-8">
                    {featuredHighlights.map((h) => (
                      <div key={h.label}>
                        <div className="font-display text-[34px] leading-none text-fg-hi">{h.value}</div>
                        <div className="mt-1.5 font-data text-[10.5px] text-fg-dim">
                          {h.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <dl className="mt-6 grid max-w-[640px] grid-cols-[110px_1fr] gap-x-4 gap-y-1.5 font-data text-[12px]">
                  <dt className="text-fg-dim">kind</dt>
                  <dd className="text-fg-body">{project.eyebrow.toLowerCase()}</dd>
                  <dt className="text-fg-dim">stack</dt>
                  <dd className="text-fg-body">{project.tags.join(" · ")}</dd>
                  {project.detail && (
                    <>
                      <dt className="text-fg-dim">guarantee</dt>
                      <dd className="text-signal-soft">{project.detail}</dd>
                    </>
                  )}
                  {project.metric && (
                    <>
                      <dt className="text-fg-dim">{project.metric.label}</dt>
                      <dd className="text-signal-soft">{project.metric.value}</dd>
                    </>
                  )}
                  {project.links.github && (
                    <>
                      <dt className="text-fg-dim">source</dt>
                      <dd>
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-signal underline decoration-signal/30 underline-offset-4 transition-colors hover:decoration-signal"
                        >
                          github.com/rahulbhardwaj94/{project.slug} ↗
                        </a>
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
