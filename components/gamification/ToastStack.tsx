"use client";

import React from "react";
import { useGamification } from "./GamificationContext";

export function ToastStack() {
  const { toasts, dismissToast } = useGamification();

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.exit ? "exit" : ""}`}>
          <div className="trophy">{t.icon || "🏆"}</div>
          <div>
            <div className="ttl">{t.kicker || "ACHIEVEMENT UNLOCKED"}</div>
            <div className="name">{t.name}</div>
            {t.sub && (
              <div className="ttl" style={{ marginTop: 4, textTransform: "none", letterSpacing: 0 }}>
                {t.sub}
              </div>
            )}
          </div>
          <div className="close" onClick={() => dismissToast(t.id)}>
            ×
          </div>
        </div>
      ))}
    </div>
  );
}
