import Link from "next/link";
import { incidents } from "@/data/incidents";
import { Reveal } from "./Reveal";

export function IncidentsSection() {
  return (
    <section
      id="incidents"
      className="relative z-[5] mx-auto max-w-[1240px] scroll-mt-20 px-5 py-[90px] md:px-16 md:py-[120px]"
    >
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="home-eyebrow mb-4">02 — Incidents</div>
            <h2 className="font-display text-[44px] leading-[1] text-fg-hi md:text-[64px]">
              Postmortems, resolved.
            </h2>
          </div>
          <p className="m-0 max-w-[360px] text-[15px] font-light leading-[1.6] text-fg-soft">
            Three production stories from fintech and manufacturing — what broke, how I found
            it, and the numbers after.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-3">
        {incidents.map((inc, i) => (
          <Reveal key={inc.id} delay={i * 0.08} className="h-full">
            <Link
              href={inc.href}
              className="panel group flex h-full flex-col p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-signal/50 md:p-7"
            >
              <div className="flex items-center justify-between font-data text-[10.5px]">
                <span className="flex items-center gap-2 text-fg-dim">
                  <span className="text-sev">{inc.sev}</span>
                  {inc.id}
                </span>
                <span className="rounded-[3px] border border-ok/40 px-1.5 py-[1px] text-ok">resolved</span>
              </div>

              <div className="mt-8 flex items-baseline gap-3 whitespace-nowrap font-display leading-none">
                {inc.from && (
                  <>
                    <span className="text-[28px] text-fg-dim line-through decoration-fg-dim/60 decoration-1">
                      {inc.from}
                    </span>
                    <span className="font-data text-[14px] text-signal">→</span>
                  </>
                )}
                <span className="text-[56px] text-signal">{inc.to}</span>
              </div>
              <div className="mt-2 font-data text-[11px] text-fg-dim">
                {inc.unit}
              </div>

              <h3 className="mt-7 font-display text-[24px] leading-[1.15] text-fg-hi">{inc.title}</h3>
              <p className="mt-3 text-[14.5px] font-light leading-[1.6] text-fg-soft">{inc.summary}</p>

              <div className="mt-auto flex items-center justify-between gap-4 pt-7 font-data text-[11px] text-fg-dim">
                <span className="truncate">{inc.meta}</span>
                <span className="shrink-0 text-signal transition-transform duration-300 group-hover:translate-x-1">
                  read →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
