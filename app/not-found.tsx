"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
        fontFamily: "var(--font-jetbrains), monospace",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: "48px 40px",
          maxWidth: 480,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
          404 · NOT FOUND
        </div>
        <h1
          style={{
            fontSize: "clamp(48px, 8vw, 72px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            margin: "0 0 20px",
            fontFamily: "var(--font-geist), sans-serif",
          }}
        >
          This page
          <br />
          <span style={{ color: "var(--accent)" }}>doesn&apos;t exist</span>.
        </h1>
        <p
          style={{
            color: "var(--dim)",
            fontSize: 15,
            lineHeight: 1.6,
            margin: "0 0 32px",
            fontFamily: "var(--font-geist), sans-serif",
          }}
        >
          Unlike production bugs, this one is easy to fix.
          Go back to somewhere that works.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              padding: "12px 24px",
              border: "1px solid var(--accent-glow)",
              borderRadius: 10,
              color: "var(--accent)",
              textDecoration: "none",
              fontSize: 13,
              letterSpacing: "0.04em",
              background: "var(--accent-soft)",
              transition: "all 200ms ease",
            }}
          >
            ← back to portfolio
          </Link>
          <Link
            href="/case-studies/billing"
            style={{
              padding: "12px 24px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "var(--dim)",
              textDecoration: "none",
              fontSize: 13,
              letterSpacing: "0.04em",
              background: "rgba(255,255,255,0.02)",
              transition: "all 200ms ease",
            }}
          >
            read a war story ↗
          </Link>
        </div>
      </div>
      <div style={{ marginTop: 32, fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em" }}>
        ENOENT: no such page
      </div>
    </div>
  );
}
