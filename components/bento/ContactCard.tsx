"use client";

import React, { useRef } from "react";
import { CardEyebrow } from "./CardEyebrow";
import { IconGithub, IconLinkedin, IconMail, IconX } from "@/components/icons";
import { useGamification } from "@/components/gamification/GamificationContext";

export function ContactCard() {
  const { onContactLongHover } = useGamification();
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const fired = useRef(false);

  const onEnter = () => {
    if (fired.current) return;
    hoverTimer.current = setTimeout(() => {
      fired.current = true;
      onContactLongHover();
    }, 2000);
  };

  const onLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <section className="card col-4" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <CardEyebrow num="08" label="// contact / let's talk" />
      <div style={{ fontSize: 14, color: "var(--dim)", lineHeight: 1.5 }}>
        Healthtech, fintech, dev tools.
        <br />
        Remote-global, remote-India, or hybrid in Bengaluru / Delhi.
      </div>
      <div className="contact-grid">
        <a className="contact-row" href="mailto:rhlbhrdwj3@gmail.com">
          <span className="glyph">
            <IconMail size={14} />
          </span>
          <span className="lbl">email</span>
        </a>
        <a
          className="contact-row"
          href="https://www.linkedin.com/in/rahul-bhardwaj-sde/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="glyph">
            <IconLinkedin size={14} />
          </span>
          <span className="lbl">linkedin</span>
        </a>
        <a
          className="contact-row"
          href="https://github.com/rahulbhardwaj94"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="glyph">
            <IconGithub size={14} />
          </span>
          <span className="lbl">github</span>
        </a>
        <a
          className="contact-row"
          href="https://x.com/rahulbhardwaj"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="glyph">
            <IconX size={14} />
          </span>
          <span className="lbl">x / twitter</span>
        </a>
      </div>
    </section>
  );
}
