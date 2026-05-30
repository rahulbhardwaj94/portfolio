"use client";

import React from "react";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { IconLock } from "@/components/icons";
import { useGamification } from "./GamificationContext";

export function AchievementsModal() {
  const { showModal, setShowModal, unlocked } = useGamification();

  if (!showModal) return null;

  return (
    <div className="modal-backdrop" onClick={() => setShowModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">Achievements</div>
            <div className="modal-sub">
              {unlocked.size} / {ACHIEVEMENTS.length} unlocked
            </div>
          </div>
          <button className="icon-btn" onClick={() => setShowModal(false)}>
            ×
          </button>
        </div>
        <div className="ach-list">
          {ACHIEVEMENTS.map((a) => {
            const got = unlocked.has(a.id);
            return (
              <div key={a.id} className={`ach-row ${got ? "" : "locked"}`}>
                <div className="icon">{got ? "🏆" : <IconLock size={16} />}</div>
                <div>
                  <div className="name">{got ? a.name : "???"}</div>
                  <div className="desc">{got ? a.desc : "locked · keep exploring"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
