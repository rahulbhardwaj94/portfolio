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
      className={`border-b border-paper-faint/40 transition-colors ${
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
          className={`font-trace text-[12px] text-paper-dim transition-transform duration-300 ${
            open ? "rotate-90 text-phosphor" : ""
          }`}
        >
          ▸
        </span>
        <span className="flex items-baseline gap-3">
          <span className={`font-serif text-[26px] leading-none md:text-[30px] ${open ? "text-phosphor" : "text-paper-hi"}`}>
            {project.name}
          </span>
        </span>
        <span className="hidden truncate font-trace text-[11.5px] uppercase tracking-[1.5px] text-paper-dim md:block">
          {project.eyebrow}
        </span>
        <span className="flex items-center gap-2 font-trace text-[11px] text-paper-dim">
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
                <p className="max-w-[640px] text-[16px] font-light leading-[1.65] text-paper-body">
                  {project.blurb}
                </p>

                {project.featured && (
                  <div className="mt-6 flex flex-wrap gap-8">
                    {featuredHighlights.map((h) => (
                      <div key={h.label}>
                        <div className="font-serif text-[34px] leading-none text-paper-hi">{h.value}</div>
                        <div className="mt-1.5 font-trace text-[10.5px] uppercase tracking-[1.5px] text-paper-dim">
                          {h.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <dl className="mt-6 grid max-w-[640px] grid-cols-[110px_1fr] gap-x-4 gap-y-1.5 font-trace text-[12px]">
                  <dt className="text-paper-dim">kind</dt>
                  <dd className="text-paper-body">{project.eyebrow.toLowerCase()}</dd>
                  <dt className="text-paper-dim">stack</dt>
                  <dd className="text-paper-body">{project.tags.join(" · ")}</dd>
                  {project.detail && (
                    <>
                      <dt className="text-paper-dim">guarantee</dt>
                      <dd className="text-phosphor-soft">{project.detail}</dd>
                    </>
                  )}
                  {project.metric && (
                    <>
                      <dt className="text-paper-dim">{project.metric.label}</dt>
                      <dd className="text-phosphor-soft">{project.metric.value}</dd>
                    </>
                  )}
                  {project.links.github && (
                    <>
                      <dt className="text-paper-dim">source</dt>
                      <dd>
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-phosphor underline decoration-phosphor/30 underline-offset-4 transition-colors hover:decoration-phosphor"
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
