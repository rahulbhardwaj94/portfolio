"use client";

import React from "react";
import { CardEyebrow } from "./CardEyebrow";
import { useGamification } from "@/components/gamification/GamificationContext";

export function HeroCard() {
  const { xpPct } = useGamification();
  const xpInt = Math.round(xpPct);
  const xpDisplayed = Math.round(4847 * Math.min(xpPct / 97, 1));

  return (
    <section className="card hero col-7 row-2">
      <div>
        <CardEyebrow
          num="01"
          label="// rahul.bhardwaj"
          right={
            <span className="pill" style={{ fontSize: 11 }}>
              <span className="dot" /> open to senior swe roles
            </span>
          }
        />
        <h1 className="display hero-name">
          Rahul<span className="slash">.</span>
        </h1>
        <p className="hero-tag">
          Backend engineer who ships things that save money and survive production.
          I write debugging stories with lessons attached.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="statblock">
          <div className="lvl">LVL 47 &nbsp;BACKEND ENGINEER</div>
          <div className="branch">
            ├─ <span style={{ color: "var(--dim)" }}>XP:</span>&nbsp;
            <span className="xp-row" style={{ width: "min(360px, 60%)" }}>
              <span className="val">{xpDisplayed.toLocaleString("en-IN")}</span>
              <span style={{ color: "var(--dim)" }}>/ 5,000</span>
              <span className="xp-bar">
                <span style={{ width: `${xpPct}%` }} />
              </span>
              <span className="xp-pct mono">{xpInt}%</span>
            </span>
          </div>
          <div className="branch">
            ├─ <span style={{ color: "var(--dim)" }}>Class:</span>{" "}
            <span className="val">NestJS Mage</span>
          </div>
          <div className="branch">
            ├─ <span style={{ color: "var(--dim)" }}>Specialization:</span>{" "}
            <span className="val">Production Debugging</span>
          </div>
          <div className="branch">
            └─ <span style={{ color: "var(--dim)" }}>Next unlock:</span>{" "}
            <span className="accent">Staff Engineer</span>
          </div>
        </div>
        <div className="hero-loc">
          <span>Delhi · India</span>
          <span className="sep">/</span>
          <span>Tech Four Solutions → Spark Minda</span>
          <span className="sep">/</span>
          <span>prev. FlexiLoans · 3y</span>
        </div>
      </div>
    </section>
  );
}
