export interface Achievement {
  id: string;
  name: string;
  desc: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_visit", name: "First Visit", desc: "Welcome to the rabbit hole." },
  { id: "curious_reader", name: "Curious Reader", desc: "Opened a case study." },
  { id: "deep_diver", name: "Deep Diver", desc: "Read past 90% of a case study." },
  { id: "brave_soul", name: "Brave Soul", desc: "Pressed the button you were told not to press." },
  { id: "incident_commander", name: "Incident Commander", desc: "Resolved the production incident on the first try." },
  { id: "insider", name: "Insider", desc: "Entered the Konami code." },
  { id: "ready_to_hire", name: "Ready to Hire?", desc: "Hovered the contact card for a while." },
];

export const STORAGE_KEY = "rb_portfolio_state_v1";

export interface PersistedState {
  achievements: string[];
  sudo: boolean;
}

export function loadState(): PersistedState {
  if (typeof window === "undefined") return { achievements: [], sudo: false };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return { achievements: [], sudo: false };
  }
}

export function saveState(s: Partial<PersistedState>): void {
  if (typeof window === "undefined") return;
  const prev = loadState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, ...s }));
}
