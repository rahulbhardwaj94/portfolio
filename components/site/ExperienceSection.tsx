import { experience } from "@/data/experience";
import { Reveal } from "./Reveal";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative z-[5] mx-auto max-w-[1240px] px-6 pb-10 pt-[90px] md:px-16 md:pt-[120px]"
    >
      <Reveal className="mb-11">
        <div className="home-eyebrow mb-3.5">03 — Experience</div>
        <h2 className="font-grotesk text-[32px] font-semibold tracking-[-1.2px] text-[#f0f1f2] md:text-[40px]">
          Where the foundation was laid
        </h2>
      </Reveal>

      <div className="border-t border-white/[0.08]">
        {experience.map((entry, i) => (
          <Reveal key={entry.title} delay={i * 0.06}>
            <div className="grid grid-cols-1 gap-2 border-b border-white/[0.08] px-1 py-7 md:grid-cols-[180px_1fr_260px] md:gap-7">
              <div
                className={`font-plexmono text-[13px] ${
                  entry.current ? "text-cyan" : "text-[#808489]"
                }`}
              >
                {entry.period}
              </div>
              <div>
                <div className="font-grotesk text-[19px] font-semibold text-[#f0f1f2]">
                  {entry.title}
                </div>
                <div className="mt-[5px] text-sm font-light leading-[1.55] text-[#8f9398]">
                  {entry.description}
                </div>
              </div>
              <div className="flex flex-wrap content-start gap-[7px]">
                {entry.tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
