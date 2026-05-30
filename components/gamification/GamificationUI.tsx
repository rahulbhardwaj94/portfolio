"use client";

import React from "react";
import { IconMute, IconSound } from "@/components/icons";
import { useGamification } from "./GamificationContext";
import { ToastStack } from "./ToastStack";
import { AchievementsModal } from "./AchievementsModal";
import { IncidentOverlay } from "./IncidentOverlay";

export function GamificationUI() {
  const { sudo, sound, setSound, unlocked, showCrt, setShowModal } = useGamification();

  return (
    <>
      {/* Achievement badge — top right */}
      <div className="achievement-badge" onClick={() => setShowModal(true)} title="achievements">
        <span className="trophy">🏆</span>
        <span>
          {unlocked.size}/{7}
        </span>
      </div>

      {/* Sudo badge — bottom left */}
      {sudo && (
        <div className="sudo-badge">
          <span className="live-dot" />
          <span>sudo · root</span>
        </div>
      )}

      {/* Sound toggle — bottom right */}
      <button
        className="sound-toggle"
        onClick={() => setSound(!sound)}
        title={sound ? "sound on" : "sound off"}
      >
        {sound ? <IconSound size={15} /> : <IconMute size={15} />}
      </button>

      <ToastStack />
      <AchievementsModal />
      <IncidentOverlay />
      {showCrt && <div className="crt" />}
    </>
  );
}
