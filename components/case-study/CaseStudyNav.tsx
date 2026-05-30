"use client";

import React from "react";
import Link from "next/link";

interface CaseStudyNavProps {
  chapterNum: string;
  chapterLabel: string;
}

export function CaseStudyNav({ chapterNum, chapterLabel }: CaseStudyNavProps) {
  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <Link href="/" className="back mono">
          ← back to portfolio
        </Link>
        <div className="crumb mono">
          <span>writing</span>
          <span className="sep">/</span>
          <span>case studies</span>
          <span className="sep">/</span>
          <span className="curr">
            {chapterNum} · {chapterLabel}
          </span>
        </div>
      </div>
    </nav>
  );
}
