"use client";

import React from "react";
import { CardEyebrow } from "./CardEyebrow";

const posts = [
  {
    title: "From 6 minutes to 11 seconds: a billing job autopsy",
    meta: "linkedin · 4 min · 312 reactions",
    href: "https://www.linkedin.com/in/rahul-bhardwaj-sde/",
  },
  {
    title: "The nginx 413 carousel: why your upload silently dies",
    meta: "linkedin · 6 min · 287 reactions",
    href: "https://www.linkedin.com/in/rahul-bhardwaj-sde/",
  },
  {
    title: "Three years at a fintech, in honest bullet points",
    meta: "linkedin · 3 min · 514 reactions",
    href: "https://www.linkedin.com/in/rahul-bhardwaj-sde/",
  },
];

export function WritingCard() {
  return (
    <section className="card col-4">
      <CardEyebrow
        num="05"
        label="// writing / debugging stories"
        right={
          <a
            className="mono dim"
            style={{ fontSize: 11 }}
            href="https://www.linkedin.com/in/rahul-bhardwaj-sde/"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin ↗
          </a>
        }
      />
      <div style={{ marginTop: -4 }}>
        {posts.map((p, i) => (
          <a key={i} className="post" href={p.href} target="_blank" rel="noopener noreferrer">
            <div>
              <div className="post-title">{p.title}</div>
              <div className="post-meta">{p.meta}</div>
            </div>
            <div className="post-arrow">↗</div>
          </a>
        ))}
      </div>
    </section>
  );
}
