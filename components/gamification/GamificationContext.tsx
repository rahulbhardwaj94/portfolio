"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ACHIEVEMENTS, loadState, saveState } from "@/lib/achievements";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Toast {
  id: string;
  name: string;
  kicker?: string;
  sub?: string;
  icon?: string;
  exit?: boolean;
}

interface GamificationState {
  sudo: boolean;
  xpPct: number;
  sound: boolean;
  unlocked: Set<string>;
  toasts: Toast[];
  showModal: boolean;
  showCrt: boolean;
  showIncident: boolean;
  setSound: (v: boolean) => void;
  setShowModal: (v: boolean) => void;
  unlock: (id: string) => void;
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  triggerCrtAndSudo: () => void;
  onPressDanger: () => void;
  onIncidentResolve: (result: { success: boolean; elapsed: number }) => void;
  onIncidentClose: () => void;
  onContactLongHover: () => void;
  onTapLogo: () => void;
  onCaseStudyOpen: () => void;
}

const GamificationContext = createContext<GamificationState | null>(null);

export function useGamification(): GamificationState {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification used outside provider");
  return ctx;
}

// ─── Sound hook ───────────────────────────────────────────────────────────────

function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback(() => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext ||
          (window as typeof window & { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return ctxRef.current;
  }, [enabled]);

  const blip = useCallback(
    (freq = 660, dur = 0.12, type: OscillatorType = "sine", gain = 0.04) => {
      const ctx = ensure();
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur);
    },
    [ensure]
  );

  const ding = useCallback(() => {
    if (!enabled) return;
    blip(880, 0.1, "triangle", 0.06);
    setTimeout(() => blip(1320, 0.16, "triangle", 0.05), 90);
  }, [enabled, blip]);

  const alert = useCallback(() => {
    if (!enabled) return;
    blip(220, 0.18, "square", 0.05);
    setTimeout(() => blip(180, 0.2, "square", 0.05), 200);
  }, [enabled, blip]);

  return { blip, ding, alert };
}

// ─── Konami hook ──────────────────────────────────────────────────────────────

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

function useKonami(onUnlock: () => void) {
  useEffect(() => {
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buf.push(k);
      if (buf.length > KONAMI.length) buf = buf.slice(-KONAMI.length);
      if (buf.length === KONAMI.length && buf.every((v, i) => v === KONAMI[i])) {
        onUnlock();
        buf = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onUnlock]);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const persisted = useRef(loadState()).current;
  const [unlocked, setUnlocked] = useState<Set<string>>(() => new Set(persisted.achievements || []));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [sudo, setSudo] = useState(!!persisted.sudo);
  const [sound, setSound] = useState(false);
  const [showCrt, setShowCrt] = useState(false);
  const [showIncident, setShowIncident] = useState(false);
  const [xpPct, setXpPct] = useState(0);
  const dingFiredRef = useRef(false);
  const logoTapsRef = useRef<number[]>([]);

  const audio = useSound(sound);

  useEffect(() => {
    document.documentElement.classList.toggle("sudo", sudo);
  }, [sudo]);

  useEffect(() => {
    saveState({ sudo, achievements: Array.from(unlocked) });
  }, [sudo, unlocked]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((p) => (p.id === id ? { ...p, exit: true } : p)));
      setTimeout(() => setToasts((prev) => prev.filter((p) => p.id !== id)), 280);
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const unlock = useCallback(
    (id: string) => {
      setUnlocked((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        const meta = ACHIEVEMENTS.find((a) => a.id === id);
        if (meta) {
          pushToast({ name: meta.name, sub: meta.desc });
          audio.ding();
        }
        return next;
      });
    },
    [pushToast, audio]
  );

  // First visit
  useEffect(() => {
    const t = setTimeout(() => unlock("first_visit"), 2000);
    return () => clearTimeout(t);
  }, [unlock]);

  const triggerCrtAndSudo = useCallback(() => {
    if (sudo) return;
    setShowCrt(true);
    document.documentElement.classList.add("crt-flicker");
    audio.alert();
    setTimeout(() => {
      setSudo(true);
      pushToast({
        name: "sudo mode enabled",
        sub: "+ war stories archive · accent flipped",
        kicker: "ROOT ACCESS",
      });
      unlock("insider");
      setTimeout(() => {
        setShowCrt(false);
        document.documentElement.classList.remove("crt-flicker");
      }, 280);
    }, 280);
  }, [sudo, audio, pushToast, unlock]);

  useKonami(triggerCrtAndSudo);

  const onPressDanger = useCallback(() => {
    unlock("brave_soul");
    setShowCrt(true);
    document.documentElement.classList.add("crt-flicker");
    audio.alert();
    setTimeout(() => {
      setShowCrt(false);
      document.documentElement.classList.remove("crt-flicker");
      setShowIncident(true);
    }, 440);
  }, [unlock, audio]);

  const onIncidentResolve = useCallback(
    ({ success, elapsed }: { success: boolean; elapsed: number }) => {
      setShowIncident(false);
      if (success) {
        unlock("incident_commander");
        pushToast({
          name: `incident resolved in ${elapsed}s`,
          sub: "you'd survive on-call.",
          icon: "✓",
          kicker: "PRODUCTION RESTORED",
        });
      } else {
        pushToast({
          name: "incident auto-mitigated",
          sub: "senior engineer paged. learn the playbook.",
          icon: "!",
          kicker: "POSTMORTEM SCHEDULED",
        });
      }
    },
    [unlock, pushToast]
  );

  const onIncidentClose = useCallback(() => setShowIncident(false), []);
  const onContactLongHover = useCallback(() => unlock("ready_to_hire"), [unlock]);
  const onCaseStudyOpen = useCallback(() => unlock("curious_reader"), [unlock]);

  // Scroll-driven XP
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 100 : Math.min(100, (window.scrollY / max) * 100);
      setXpPct(pct);
      if (pct >= 99 && !dingFiredRef.current) {
        dingFiredRef.current = true;
        audio.ding();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [audio]);

  // Mobile logo tap (5 taps within 1.5s)
  const onTapLogo = useCallback(() => {
    const now = Date.now();
    logoTapsRef.current = logoTapsRef.current.filter((t) => now - t < 1500);
    logoTapsRef.current.push(now);
    if (logoTapsRef.current.length >= 5) {
      logoTapsRef.current = [];
      triggerCrtAndSudo();
    }
  }, [triggerCrtAndSudo]);

  return (
    <GamificationContext.Provider
      value={{
        sudo,
        xpPct,
        sound,
        unlocked,
        toasts,
        showModal,
        showCrt,
        showIncident,
        setSound,
        setShowModal,
        unlock,
        pushToast,
        dismissToast,
        triggerCrtAndSudo,
        onPressDanger,
        onIncidentResolve,
        onIncidentClose,
        onContactLongHover,
        onTapLogo,
        onCaseStudyOpen,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}
