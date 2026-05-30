"use client";

import React from "react";
import Link from "next/link";
import { CardEyebrow } from "./CardEyebrow";
import { useGamification } from "@/components/gamification/GamificationContext";

const items = [
  {
    n: "01",
    title: "How I saved ₹30 lakhs a year with one bureau integration",
    meta: "fintech · cibil · cost engineering · 8 min read",
    href: "/case-studies/cibil",
  },
  {
    n: "02",
    title: "From 6 minutes to 11 seconds: a billing job autopsy",
    meta: "mysql · redis · performance · 12 min read",
    href: "/case-studies/billing",
  },
  {
    n: "03",
    title: "Migrating 23 microservices from ECS to EKS without downtime",
    meta: "kubernetes · aws · infrastructure · 10 min read",
    href: "/case-studies/eks-migration",
  },
];

export function CaseStudiesCard() {
  const { onCaseStudyOpen } = useGamification();

  return (
    <section className="card col-8">
      <CardEyebrow
        num="07"
        label="// war stories / case studies"
        right={
          <span className="mono dim" style={{ fontSize: 11 }}>
            3 of 3 published
          </span>
        }
      />
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <h2 className="display" style={{ fontSize: 28, margin: 0 }}>
          Real bugs, with the receipts.
        </h2>
      </div>
      <p className="muted" style={{ fontSize: 13.5, maxWidth: 520, marginTop: 4, marginBottom: 10 }}>
        Every story has the same shape: what broke, how I diagnosed it, what I&apos;d do
        differently. No clickbait, no rewriting history.
      </p>
      <div className="case-list">
        {items.map((c) => (
          <Link key={c.n} className="case-item" href={c.href} onClick={onCaseStudyOpen}>
            <div className="case-num">{c.n}</div>
            <div>
              <div className="case-title">{c.title}</div>
              <div className="case-meta">
                {c.meta} <span style={{ color: "var(--accent)" }}>· read</span>
              </div>
            </div>
            <div className="case-arrow">↗</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
