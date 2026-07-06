import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

export function WorkSection() {
  return (
    <section
      id="work"
      className="relative z-[5] mx-auto max-w-[1240px] px-6 py-[90px] md:px-16 md:py-[120px]"
    >
      <Reveal>
        <div className="mb-11 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="home-eyebrow mb-3.5">01 — Selected Work</div>
            <h2 className="font-grotesk text-[34px] font-semibold tracking-[-1.4px] text-[#f0f1f2] md:text-[44px]">
              AI &amp; open-source systems
            </h2>
          </div>
          <p className="m-0 max-w-[340px] text-[15px] font-light leading-[1.6] text-[#8f9398]">
            Production infrastructure for agents — orchestration, evaluation,
            memory, and governance.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3 md:auto-rows-[minmax(232px,auto)]">
        {projects.map((project, i) => (
          <Reveal
            key={project.slug}
            delay={i * 0.05}
            className={`min-h-[200px] ${
              project.featured ? "md:col-span-2 md:row-span-2" : ""
            }`}
          >
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
