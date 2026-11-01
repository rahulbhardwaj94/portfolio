"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { trace, traceMeta, type TraceSpan } from "@/data/trace";

const toYear = (d: Date) => d.getFullYear() + d.getMonth() / 12 + d.getDate() / 365;

/**
 * The hero's signature visual: the career rendered as a distributed-trace
 * waterfall. Bars grow in sequence like spans arriving; open spans run to a
 * pulsing "now" line. Outcome spans link to their case study.
 */
export function TraceWaterfall() {
  const reduced = useReducedMotion();
  // Fixed fallback keeps SSR and first client render identical.
  const [now, setNow] = useState(2026.84);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => setNow(toYear(new Date())), []);

  const { axisStart, axisEnd, ticks, traceId } = traceMeta;
  const pct = (y: number) => ((y - axisStart) / (axisEnd - axisStart)) * 100;

  return (
    <div className="panel scanlines overflow-hidden">
      {/* header strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-faint/50 px-4 py-2.5 font-trace text-[10.5px] uppercase tracking-[1.5px] text-paper-dim md:px-5">
        <span className="flex items-center gap-2">
          <span className="span-live h-1.5 w-1.5 rounded-full bg-phosphor" />
          trace <span className="text-paper-soft">{traceId.slice(0, 16)}</span>
        </span>
        <span className="hidden sm:inline">
          {trace.length} spans · <span className="text-ok">0 errors</span>
        </span>
      </div>

      <div className="relative px-4 pb-4 pt-2 md:px-5">
        {/* axis */}
        <div className="grid grid-cols-[112px_1fr] gap-3 md:grid-cols-[260px_1fr] md:gap-5">
          <div />
          <div className="relative h-6 font-trace text-[10px] text-paper-faint">
            {ticks.map((t) => (
              <span key={t} className="absolute top-1.5 -translate-x-1/2" style={{ left: `${pct(t)}%` }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* gridlines + now marker live in the track column */}
          <div className="pointer-events-none absolute inset-y-0 left-[124px] right-0 md:left-[280px]">
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute inset-y-0 w-px bg-paper-faint/25"
                style={{ left: `${pct(t)}%` }}
              />
            ))}
            <span
              className="absolute inset-y-[-8px] w-px bg-phosphor/70"
              style={{ left: `${pct(now)}%`, boxShadow: "0 0 12px rgba(255,181,71,0.7)" }}
            >
              <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 font-trace text-[9px] uppercase tracking-[1px] text-phosphor">
                now
              </span>
            </span>
          </div>

          {trace.map((span, i) => (
            <SpanRow
              key={span.id}
              span={span}
              index={i}
              now={now}
              pct={pct}
              reduced={!!reduced}
              dimmed={hover !== null && hover !== span.id}
              onHover={setHover}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpanRow({
  span,
  index,
  now,
  pct,
  reduced,
  dimmed,
  onHover,
}: {
  span: TraceSpan;
  index: number;
  now: number;
  pct: (y: number) => number;
  reduced: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
}) {
  const open = span.end === null;
  const end = open ? now : (span.end as number);
  const left = pct(span.start);
  const width = Math.max(pct(end) - left, 0.9);
  // Long spans carry their label inside the bar; short ones print it beside.
  const inside = width > 28;
  const before = !inside && left + width > 62;

  const barColor = span.highlight
    ? "bg-phosphor"
    : span.depth === 0
      ? "bg-paper-soft"
      : "bg-paper-soft/35";

  const Row = span.href ? "a" : "div";

  return (
    <Row
      {...(span.href ? { href: span.href } : {})}
      onMouseEnter={() => onHover(span.id)}
      onMouseLeave={() => onHover(null)}
      className={`group grid grid-cols-[112px_1fr] items-center gap-3 rounded-[4px] py-[5px] transition-opacity duration-300 md:grid-cols-[260px_1fr] md:gap-5 ${
        dimmed ? "opacity-40" : "opacity-100"
      } ${span.href ? "cursor-pointer hover:bg-white/[0.025]" : ""}`}
    >
      <div
        className="flex min-w-0 items-center gap-2 font-trace text-[11px] md:text-[12px]"
        style={{ paddingLeft: span.depth * 12 }}
      >
        {span.depth > 0 && <span className="text-paper-faint">└</span>}
        <span className="hidden text-paper-dim md:inline">{span.service}</span>
        <span className={`truncate ${span.highlight ? "text-phosphor-soft" : "text-paper-body"}`}>
          {span.op}
        </span>
      </div>

      <div className="relative h-[18px]">
        <motion.span
          // top offset, not translate: framer-motion owns this element's transform
          className={`absolute top-[2px] h-[14px] rounded-[2px] ${barColor}`}
          style={{
            left: `${left}%`,
            width: `${width}%`,
            transformOrigin: "left center",
            boxShadow: span.highlight ? "0 0 16px -2px rgba(255,181,71,0.7)" : undefined,
          }}
          initial={reduced ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 + index * 0.11, ease: [0.2, 0.7, 0.2, 1] }}
        />
        {open && (
          <span
            className="span-live absolute top-[2px] h-[14px] w-[3px] rounded-[1px] bg-phosphor"
            style={{ left: `calc(${left + width}% - 3px)` }}
          />
        )}
        <motion.span
          className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-trace text-[10px] md:text-[10.5px] ${
            // narrow screens: keep only outcome notes outside the bars
            !inside && !span.highlight ? "hidden md:block" : ""
          } ${
            inside
              ? span.depth === 0
                ? "text-night"
                : "text-paper-hi"
              : span.highlight
                ? "text-phosphor"
                : "text-paper-dim"
          }`}
          style={
            inside
              ? { left: `calc(${left}% + 8px)` }
              : before
                ? { right: `calc(${100 - left}% + 8px)` }
                : { left: `calc(${left + width}% + 8px)` }
          }
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.75 + index * 0.11 }}
        >
          {span.shortNote ? (
            <>
              <span className="md:hidden">{span.shortNote}</span>
              <span className="hidden md:inline">{span.note}</span>
            </>
          ) : (
            span.note
          )}
          {span.href && (
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
          )}
        </motion.span>
      </div>
    </Row>
  );
}
