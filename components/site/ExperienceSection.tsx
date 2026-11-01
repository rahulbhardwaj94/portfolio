import { experience } from "@/data/experience";
import { Reveal } from "./Reveal";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative z-[5] mx-auto max-w-[1240px] scroll-mt-20 px-5 pb-10 pt-[90px] md:px-16 md:pt-[120px]"
    >
      <Reveal className="mb-10">
        <div className="home-eyebrow mb-4">04 — Log</div>
        <h2 className="font-serif text-[40px] leading-[1.05] text-paper-hi md:text-[56px]">
          Where the foundation was <em className="text-phosphor">laid</em>.
        </h2>
      </Reveal>

      <div className="relative border-l border-paper-faint/50 pl-6 md:ml-[150px] md:pl-10">
        {experience.map((entry, i) => (
          <Reveal key={entry.title} delay={i * 0.06}>
            <div className="relative grid grid-cols-1 gap-3 pb-12 md:grid-cols-[1fr_240px] md:gap-10">
              {/* timeline node */}
              <span
                className={`absolute -left-[29px] top-[9px] h-[9px] w-[9px] rounded-full border md:-left-[45px] ${
                  entry.current
                    ? "span-live border-phosphor bg-phosphor"
                    : "border-paper-dim bg-night"
                }`}
              />
              {/* period, hung in the left gutter on desktop */}
              <div
                className={`font-trace text-[12px] uppercase tracking-[1.2px] md:absolute md:-left-[200px] md:top-[5px] md:w-[130px] md:text-right ${
                  entry.current ? "text-phosphor" : "text-paper-dim"
                }`}
              >
                {entry.period}
              </div>
              <div>
                <div className="font-serif text-[26px] leading-[1.15] text-paper-hi md:text-[30px]">
                  {entry.title}
                </div>
                <div className="mt-2.5 max-w-[600px] text-[15px] font-light leading-[1.65] text-paper-soft">
                  {entry.description}
                </div>
              </div>
              <div className="flex flex-wrap content-start gap-[7px] md:pt-2">
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
