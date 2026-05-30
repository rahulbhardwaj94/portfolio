"use client";

import React from "react";

interface CardEyebrowProps {
  num: string;
  label: string;
  right?: React.ReactNode;
}

export function CardEyebrow({ num, label, right }: CardEyebrowProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <div className="card-eyebrow">
        <span className="num">{num}</span>
        <span>{label}</span>
      </div>
      {right}
    </div>
  );
}
