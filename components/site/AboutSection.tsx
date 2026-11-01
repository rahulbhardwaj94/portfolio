import { about, skills } from "@/data/skills";
import { Reveal } from "./Reveal";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-[5] mx-auto max-w-[1240px] scroll-mt-20 px-5 py-[90px] md:px-16 md:py-[120px]"
    >
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1fr] md:gap-20">
        <Reveal>
          <div className="home-eyebrow mb-4">{about.eyebrow}</div>
          <h2 className="font-display text-[40px] leading-[1.05] text-fg-hi md:text-[56px]">
            {about.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-[17px] font-light leading-[1.75] text-fg-soft ${i > 0 ? "mt-5" : ""}`}
            >
              {p}
            </p>
          ))}
          <div className="mt-8 font-data text-[10.5px] text-fg-dim">
            span.attributes
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.label}
                className={`skill-pill ${s.accent ? "skill-pill-accent" : ""}`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
