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
    <div className="panel overflow-hidden">
      {/* header strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fg-faint/50 px-4 py-2.5 font-data text-[10.5px] text-fg-dim md:px-5">
        <span className="flex items-center gap-2">
          <span className="span-live h-1.5 w-1.5 rounded-full bg-signal" />
          trace <span className="text-fg-soft">{traceId.slice(0, 16)}</span>
        </span>
        <span className="hidden sm:inline">
          {trace.length} spans · <span className="text-ok">0 errors</span>
        </span>
      </div>

      <div className="relative px-4 pb-4 pt-2 md:px-5">
        {/* axis */}
        <div className="grid grid-cols-[112px_1fr] gap-3 md:grid-cols-[260px_1fr] md:gap-5">
          <div />
          <div className="relative h-6 font-data text-[10px] text-fg-dim">
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
                className="absolute inset-y-0 w-px bg-fg-faint/25"
                style={{ left: `${pct(t)}%` }}
              />
            ))}
            <span
              className="absolute inset-y-[-8px] w-px bg-signal/70"
              style={{ left: `${pct(now)}%` }}
            >
              <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 font-data text-[9px] text-signal">
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
    ? "bg-signal"
    : span.depth === 0
      ? "bg-fg-soft"
      : "bg-fg-soft/35";

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
        className="flex min-w-0 items-center gap-2 font-data text-[11px] md:text-[12px]"
        style={{ paddingLeft: span.depth * 12 }}
      >
        {span.depth > 0 && <span className="text-fg-dim">└</span>}
        <span className="hidden text-fg-dim md:inline">{span.service}</span>
        <span className={`truncate ${span.highlight ? "text-signal-soft" : "text-fg-body"}`}>
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
          }}
          initial={reduced ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 + index * 0.11, ease: [0.2, 0.7, 0.2, 1] }}
        />
        {open && (
          <span
            className="span-live absolute top-[2px] h-[14px] w-[3px] rounded-[1px] bg-signal"
            style={{ left: `calc(${left + width}% - 3px)` }}
          />
        )}
        <motion.span
          className={`absolute inset-y-0 flex items-center whitespace-nowrap font-data text-[10px] md:text-[10.5px] ${
            // narrow screens: keep only outcome notes outside the bars
            !inside && !span.highlight ? "hidden md:flex" : ""
          } ${
            inside
              ? span.depth === 0
                ? "text-night"
                : "text-fg-hi"
              : span.highlight
                ? "text-signal"
                : "text-fg-dim"
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
