"use client";

import React from "react";
import { CardEyebrow } from "./CardEyebrow";
import { useGamification } from "@/components/gamification/GamificationContext";

export function DangerCard() {
  const { onPressDanger } = useGamification();

  return (
    <section className="card danger-card col-4">
      <CardEyebrow
        num="09"
        label="// debug / not for production"
        right={
          <span className="mono" style={{ fontSize: 11, color: "var(--red)" }}>
            ⚠ p0
          </span>
        }
      />
      <div style={{ fontSize: 14, color: "var(--dim)", lineHeight: 1.55, maxWidth: 320 }}>
        Every backend engineer has one button they shouldn&apos;t have shipped. This is mine. It
        does nothing important. Probably.
      </div>
      <button className="danger-btn" onClick={onPressDanger}>
        [ DO NOT PRESS ]
      </button>
    </section>
  );
}
