import { profile } from "@/data/profile";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Topbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 backdrop-blur-[10px] md:px-10"
      style={{
        background: "linear-gradient(180deg, rgba(5,5,5,0.55), transparent)",
      }}
    >
      <div className="flex items-center gap-[11px]">
        <span
          className="h-[9px] w-[9px] rounded-full bg-cyan"
          style={{ boxShadow: "0 0 12px rgba(0,212,255,0.9)" }}
        />
        <span className="font-grotesk text-[15px] font-semibold tracking-[0.3px] text-[#f0f1f2]">
          {profile.name}
        </span>
      </div>
      <nav className="hidden items-center gap-[34px] text-[13.5px] tracking-[0.2px] text-[#9b9fa4] md:flex">
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} className="transition-colors hover:text-ink-hi">
            {l.label}
          </a>
        ))}
        <a
          href={profile.links.resume}
          className="rounded-full border border-white/[0.14] px-[15px] py-[7px] text-[#e2e3e5] transition-colors hover:border-white/25"
        >
          Résumé
        </a>
      </nav>
    </header>
  );
}
