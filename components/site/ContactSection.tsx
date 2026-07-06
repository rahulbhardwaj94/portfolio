import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-[5] mx-auto max-w-[1240px] px-6 pb-[60px] pt-[110px] md:px-16"
    >
      <Reveal>
        <div className="glass-card rounded-[26px] p-12 px-6 text-center md:px-12 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-40%] h-[520px] w-[520px] -ml-[260px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.07), rgba(255,255,255,0.02) 45%, transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="home-eyebrow mb-5">04 — Contact</div>
            <h2 className="font-grotesk text-[34px] font-semibold leading-[1.08] tracking-[-1.6px] text-ink-hi md:text-[46px]">
              {profile.contact.heading}
            </h2>
            <p className="mx-auto mt-[18px] max-w-[440px] text-base font-light leading-[1.6] text-ink-soft">
              {profile.contact.sub}
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-[30px] inline-flex items-center gap-2.5 rounded-xl px-[30px] py-[15px] text-base font-medium text-[#04252e]"
              style={{
                background: "linear-gradient(180deg, #38dbff, #00c2f0)",
                boxShadow: "0 12px 44px -14px rgba(0,212,255,0.7)",
              }}
            >
              {profile.email}
            </a>
            <div className="mt-[34px] flex justify-center gap-[26px] text-sm text-[#9fa3a8]">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink-hi"
              >
                GitHub
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink-hi"
              >
                LinkedIn
              </a>
              <a
                href={profile.links.resume}
                className="transition-colors hover:text-ink-hi"
              >
                Résumé
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-11 flex flex-wrap items-center justify-between gap-3 font-plexmono text-[11.5px] tracking-[0.5px] text-ink-faint">
        <span>© 2026 {profile.name}</span>
        <span>{profile.footerTagline}</span>
      </div>
    </section>
  );
}
