"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGamification } from "./GamificationContext";

export function IncidentOverlay() {
  const { showIncident, onIncidentResolve, onIncidentClose } = useGamification();
  const [timeLeft, setTimeLeft] = useState(15);
  const [attempts, setAttempts] = useState(0);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);
  const [forced, setForced] = useState(false);
  const startRef = useRef(Date.now());
  const speedRef = useRef(1000);

  // Reset on open
  useEffect(() => {
    if (showIncident) {
      setTimeLeft(15);
      setAttempts(0);
      setWrongIdx(null);
      setResolved(false);
      setForced(false);
      startRef.current = Date.now();
      speedRef.current = 1000;
    }
  }, [showIncident]);

  useEffect(() => {
    if (!showIncident || resolved || forced) return;
    if (timeLeft <= 0) {
      handleWrong(-1);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), speedRef.current);
    return () => clearTimeout(t);
  });

  if (!showIncident) return null;

  const handleWrong = (idx: number) => {
    setWrongIdx(idx);
    setTimeout(() => setWrongIdx(null), 380);
    const next = attempts + 1;
    setAttempts(next);
    speedRef.current = 600;
    if (next >= 2) {
      setForced(true);
      setTimeout(() => {
        setResolved(true);
        const elapsed = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
        onIncidentResolve({ success: false, elapsed });
      }, 1400);
    } else if (timeLeft <= 0) {
      setTimeLeft(8);
    }
  };

  const handleRight = () => {
    setResolved(true);
    const elapsed = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    onIncidentResolve({ success: attempts === 0, elapsed });
  };

  const options = [
    { cmd: "kubectl rollback deployment/payments-api", correct: true },
    { cmd: "kubectl delete pod payments-api-7d4b8", correct: false },
    { cmd: "kubectl scale deployment/payments-api --replicas=0", correct: false },
  ];

  return (
    <div className="incident" role="dialog" aria-modal="true">
      <div className="incident-panel">
        <div className="incident-head">
          <div>
            <div className="severity">
              <span className="blink-sq" /> production incident detected
            </div>
            <div className="incident-title">payments-api is failing in prod.</div>
          </div>
          <div className={`timer ${timeLeft <= 5 ? "warn" : ""}`}>
            <div style={{ color: "var(--muted)", fontSize: 10.5 }}>TIME TO RESOLVE</div>
            <div className="t">00:{String(Math.max(0, timeLeft)).padStart(2, "0")}</div>
          </div>
        </div>
        <div className="incident-stats">
          <div className="incident-stat">
            <div className="k">severity</div>
            <div className="v" style={{ color: "var(--red)" }}>P0</div>
          </div>
          <div className="incident-stat">
            <div className="k">service</div>
            <div className="v">payments-api</div>
          </div>
          <div className="incident-stat">
            <div className="k">affected users</div>
            <div className="v">14,287</div>
          </div>
        </div>
        <div style={{ color: "var(--muted)", fontSize: 12.5, marginBottom: 6, letterSpacing: 0.04 }}>
          Pick a command. Pick fast. The right answer is almost always the boring one.
        </div>
        {options.map((o, i) => (
          <button
            key={i}
            className={`kbtn ${wrongIdx === i ? "wrong" : ""} ${resolved && o.correct ? "right" : ""}`}
            disabled={resolved || forced}
            onClick={() => (o.correct ? handleRight() : handleWrong(i))}
          >
            <span className="glyph">$ </span>
            {o.cmd}
          </button>
        ))}
        <div className="incident-foot">
          <div>
            {forced && "→ paging the senior. (rollback is almost always the right first move.)"}
            {!forced && attempts === 1 && "→ wrong. one chance left."}
            {!forced && attempts === 0 && "→ on-call clock is running."}
          </div>
          <div style={{ cursor: "pointer" }} onClick={onIncidentClose}>
            esc
          </div>
        </div>
      </div>
    </div>
  );
}
