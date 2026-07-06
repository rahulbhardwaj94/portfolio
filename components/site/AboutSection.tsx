import { about, skills } from "@/data/skills";
import { Reveal } from "./Reveal";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-[5] mx-auto max-w-[1240px] px-6 py-[90px] md:px-16 md:py-[120px]"
    >
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal>
          <div className="home-eyebrow mb-3.5">{about.eyebrow}</div>
          <h2 className="font-grotesk text-[32px] font-semibold leading-[1.1] tracking-[-1.2px] text-[#f0f1f2] md:text-[40px]">
            {about.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-[17px] font-light leading-[1.7] text-[#a7abb0] ${
                i > 0 ? "mt-5" : ""
              }`}
            >
              {p}
            </p>
          ))}
          <div className="mt-[30px] flex flex-wrap gap-2.5">
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
