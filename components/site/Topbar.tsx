"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

const navLinks = [
  { href: "#work", label: "Spans" },
  { href: "#incidents", label: "Incidents" },
  { href: "#experience", label: "Log" },
  { href: "#contact", label: "Contact" },
];

/** Live local clock — a small "this is a real person, right now" signal. */
function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: profile.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="hidden font-data text-[11px] text-fg-dim lg:inline">
      DEL <span className="text-fg-body">{time ?? "--:--"}</span> IST
    </span>
  );
}

export function Topbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-fg-faint/30 bg-night/75 px-5 py-4 backdrop-blur-[12px] md:px-10"
    >
      <a href="#" className="flex items-center gap-3">
        {/* flight-recorder orange box */}
        <span className="h-2.5 w-2.5 rounded-[2px] bg-signal" />
        <span className="font-display text-[17px] font-medium leading-none tracking-[-0.2px] text-fg-hi">
          {profile.name}
        </span>
      </a>
      <div className="flex items-center gap-8">
        <LocalClock />
        <nav className="hidden items-center gap-7 font-data text-[11.5px] text-fg-soft md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-signal">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={profile.links.resume}
          className="rounded-[5px] border border-fg-faint px-3.5 py-1.5 font-data text-[11px] text-fg-body transition-colors hover:border-signal hover:text-signal"
        >
          Résumé
        </a>
      </div>
    </header>
  );
}
