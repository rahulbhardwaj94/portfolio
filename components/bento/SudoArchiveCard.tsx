"use client";

import React from "react";
import { CardEyebrow } from "./CardEyebrow";

const items = [
  "The 4am cron that ran 4am IST instead of UTC for 3 months",
  "Why our queue depth chart was lying — and the off-by-one in Bull",
  "How a 502 became a 504 became a postmortem with my name on it",
];

export function SudoArchiveCard() {
  return (
    <section
      className="card col-8"
      style={{ borderColor: "rgba(0,255,65,0.35)", boxShadow: "0 0 0 1px rgba(0,255,65,0.1)" }}
    >
      <CardEyebrow
        num="0x"
        label="// sudo / war stories archive"
        right={
          <span className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>
            +access granted
          </span>
        }
      />
      <h2 className="display" style={{ fontSize: 24, margin: "2px 0 6px" }}>
        The drafts folder.
      </h2>
      <p className="muted" style={{ fontSize: 13, maxWidth: 540, marginBottom: 8 }}>
        Stories not polished enough for LinkedIn but too good to delete. Three more drops coming.
      </p>
      <div className="case-list">
        {items.map((t, i) => (
          <div key={i} className="case-item" style={{ cursor: "default" }}>
            <div className="case-num" style={{ color: "var(--accent)" }}>
              0{i + 4}
            </div>
            <div>
              <div className="case-title">{t}</div>
              <div className="case-meta">draft · est. {6 + i * 2} min · unlocked</div>
            </div>
            <div className="case-arrow">↗</div>
          </div>
        ))}
      </div>
    </section>
  );
}
