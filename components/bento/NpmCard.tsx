"use client";

import React, { useEffect, useState } from "react";
import { CardEyebrow } from "./CardEyebrow";

export function NpmCard() {
  const [count, setCount] = useState(742);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => c + (Math.random() < 0.3 ? 1 : 0));
    }, 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="card col-4">
      <CardEyebrow
        num="03"
        label="// shipped / open source"
        right={
          <span className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>
            v1.2.4
          </span>
        }
      />
      <div className="terminal">
        <div className="dots">
          <i />
          <i />
          <i />
        </div>
        <div>
          <span className="prompt">~</span> <span className="cmd">npx inspecto</span>
        </div>
        <div className="out">↳ inspecting nestjs handlers…</div>
        <div className="out">
          ↳ found <span style={{ color: "var(--accent)" }}>14</span> routes ·{" "}
          <span style={{ color: "var(--accent)" }}>3</span> issues
        </div>
        <div className="out">
          ↳ ready in <span style={{ color: "var(--text)" }}>284ms</span>
          <span className="blink"> ▌</span>
        </div>
      </div>
      <div className="counter-row">
        <div className="counter mono">{count.toLocaleString("en-US")}</div>
        <div className="counter-lbl">
          <span className="live-dot" />
          weekly downloads
        </div>
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
        A NestJS route inspector. Tiny, opinionated, fast.
      </div>
    </section>
  );
}
