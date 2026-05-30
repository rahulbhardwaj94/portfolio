"use client";

import React from "react";
import { CardEyebrow } from "./CardEyebrow";
import { StackGlyph } from "@/components/icons";

const stack = ["NestJS", "Node", "TypeScript", "AWS", "Kubernetes", "Redis", "MongoDB", "MySQL"];

export function StackCard() {
  return (
    <section className="card col-4">
      <CardEyebrow num="06" label="// stack / daily drivers" />
      <div className="stack-grid">
        {stack.map((s) => (
          <div className="stack-cell" key={s}>
            <div className="glyph">
              <StackGlyph name={s} />
            </div>
            <div className="lbl">{s}</div>
          </div>
        ))}
      </div>
      <div
        className="dim"
        style={{ fontSize: 12, marginTop: 14, fontFamily: "var(--font-jetbrains), monospace" }}
      >
        + SQS · ECS · EKS · CloudWatch · Temporal · Grafana
      </div>
    </section>
  );
}
