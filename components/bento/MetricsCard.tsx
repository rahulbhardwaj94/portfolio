"use client";

import React from "react";
import { CardEyebrow } from "./CardEyebrow";

export function MetricsCard() {
  return (
    <section className="card col-5">
      <CardEyebrow num="02" label="// proof / by the numbers" />
      <div className="metrics">
        <div className="metric flex-col">
          <div className="num">
            <span className="accent">₹</span>30L{" "}
            <span className="dim" style={{ fontSize: 14, fontWeight: 400, marginLeft: 4 }}>
              / year
            </span>
          </div>
          <div className="lbl">
            Saved by replacing a CIBIL aggregator with a direct bureau integration.
          </div>
        </div>
        <div className="metric flex-col">
          <div className="num">
            6:00{" "}
            <span className="dim mono" style={{ fontSize: 22 }}>
              →
            </span>{" "}
            0:11
          </div>
          <div className="lbl">
            Billing job latency. 33× faster after a partial index + Redis pipeline rewrite.
          </div>
        </div>
        <div className="metric flex-col">
          <div className="num">
            20<span className="accent">+</span>{" "}
            <span className="dim" style={{ fontSize: 14, fontWeight: 400, marginLeft: 4 }}>
              microservices
            </span>
          </div>
          <div className="lbl">Lifted ECS to EKS with zero customer-visible downtime.</div>
        </div>
      </div>
    </section>
  );
}
