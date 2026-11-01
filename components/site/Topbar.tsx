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
    <span className="hidden font-trace text-[11px] uppercase tracking-[1.5px] text-paper-dim lg:inline">
      DEL <span className="text-paper-body">{time ?? "--:--"}</span> IST
    </span>
  );
}

export function Topbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-paper-faint/30 px-5 py-4 backdrop-blur-[12px] md:px-10"
      style={{ background: "rgba(11,10,8,0.6)" }}
    >
      <a href="#" className="flex items-center gap-3">
        <span className="grid h-7 w-7 place-items-center rounded-[5px] border border-phosphor/50 font-serif text-[17px] italic leading-none text-phosphor">
          r
        </span>
        <span className="font-serif text-[19px] leading-none text-paper-hi">{profile.name}</span>
      </a>
      <div className="flex items-center gap-8">
        <LocalClock />
        <nav className="hidden items-center gap-7 font-trace text-[11.5px] uppercase tracking-[1.5px] text-paper-soft md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-phosphor">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={profile.links.resume}
          className="rounded-[5px] border border-paper-faint px-3.5 py-1.5 font-trace text-[11px] uppercase tracking-[1.5px] text-paper-body transition-colors hover:border-phosphor hover:text-phosphor"
        >
          Résumé
        </a>
      </div>
    </header>
  );
}
