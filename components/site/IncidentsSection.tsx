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
            <h2 className="font-serif text-[44px] leading-[1] text-paper-hi md:text-[64px]">
              Postmortems, <em className="text-phosphor">resolved</em>.
            </h2>
          </div>
          <p className="m-0 max-w-[360px] text-[15px] font-light leading-[1.6] text-paper-soft">
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
              className="panel group flex h-full flex-col p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-phosphor/50 md:p-7"
            >
              <div className="flex items-center justify-between font-trace text-[10.5px] uppercase tracking-[1.5px]">
                <span className="flex items-center gap-2 text-paper-dim">
                  <span className="text-sev">{inc.sev}</span>
                  {inc.id}
                </span>
                <span className="rounded-[3px] border border-ok/40 px-1.5 py-[1px] text-ok">resolved</span>
              </div>

              <div className="mt-8 flex items-baseline gap-3 font-serif leading-none">
                {inc.from && (
                  <>
                    <span className="text-[34px] text-paper-faint line-through decoration-sev/50 decoration-1">
                      {inc.from}
                    </span>
                    <span className="font-trace text-[14px] text-phosphor">→</span>
                  </>
                )}
                <span className="phosphor-glow text-[64px] text-phosphor">{inc.to}</span>
              </div>
              <div className="mt-2 font-trace text-[11px] uppercase tracking-[1.2px] text-paper-dim">
                {inc.unit}
              </div>

              <h3 className="mt-7 font-serif text-[24px] leading-[1.15] text-paper-hi">{inc.title}</h3>
              <p className="mt-3 text-[14.5px] font-light leading-[1.6] text-paper-soft">{inc.summary}</p>

              <div className="mt-auto flex items-center justify-between gap-4 pt-7 font-trace text-[11px] text-paper-dim">
                <span className="truncate">{inc.meta}</span>
                <span className="shrink-0 text-phosphor transition-transform duration-300 group-hover:translate-x-1">
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
