import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-[5] mx-auto max-w-[1240px] scroll-mt-20 px-5 pb-[48px] pt-[100px] md:px-16"
    >
      <Reveal>
        <div className="panel overflow-hidden px-6 py-14 md:px-14 md:py-20">
          <div className="relative grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-end">
            <div>
              <div className="home-eyebrow mb-5">05 — Open a trace</div>
              <h2 className="font-display text-[48px] leading-[0.98] text-fg-hi md:text-[80px]">
                Let&apos;s build reliable agents.
              </h2>
              <p className="mt-6 max-w-[440px] text-[16px] font-light leading-[1.65] text-fg-soft">
                {profile.contact.sub}
              </p>
            </div>
            <div className="flex flex-col gap-5 md:items-end">
              <a href={`mailto:${profile.email}`} className="btn-signal w-fit">
                {profile.email}
              </a>
              <div className="flex gap-6 font-data text-[11.5px] text-fg-soft">
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-signal"
                >
                  GitHub ↗
                </a>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-signal"
                >
                  LinkedIn ↗
                </a>
                <a href={profile.links.resume} className="transition-colors hover:text-signal">
                  Résumé
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 font-data text-[11px] text-fg-dim">
        <span>© 2026 {profile.name} · {profile.location}</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          {profile.footerTagline}
        </span>
      </div>
    </section>
  );
}
