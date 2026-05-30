"use client";

import React from "react";
import { CardEyebrow } from "./CardEyebrow";

const items = [
  {
    title: "Ledgerwise",
    tag: "WIP",
    desc: "Co-lending & bureau reconciliation SaaS for NBFCs. NestJS + Postgres + Temporal.",
  },
  {
    title: "Go, the slow way",
    desc: "Rewriting one of my Node services in Go to feel the trade-offs, not just read about them.",
  },
  {
    title: "MySQL / MongoDB internals",
    desc: "Indexes, isolation, replication. System design that survives a real on-call.",
  },
];

export function NowBuildingCard() {
  return (
    <section className="card col-4">
      <CardEyebrow num="04" label="// now / building" />
      <div className="nb-list">
        {items.map((it, i) => (
          <div key={i} className="nb-row">
            <div className="nb-marker">{String(i + 1).padStart(2, "0")}</div>
            <div>
              <div className="nb-title">
                {it.title}
                {it.tag && <span className="nb-tag">{it.tag}</span>}
              </div>
              <div className="nb-desc">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
